import { createContext, useContext, useEffect, useState } from "react";
import { getPlan } from "../data/plans";

const AuthContext = createContext(null);
const USERS_KEY = "wickmere_users";
const SESSION_KEY = "wickmere_session";

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [session, setSession] = useState(() => localStorage.getItem(SESSION_KEY) || "");

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const valid = users.some((entry) => entry.email === session);
    if (session && valid) localStorage.setItem(SESSION_KEY, session);
    else localStorage.removeItem(SESSION_KEY);
  }, [session, users]);

  const user = users.find((entry) => entry.email === session) || null;

  const signup = ({ name, email, password }) => {
    const normalized = email.trim().toLowerCase();
    if (users.some((entry) => entry.email === normalized)) {
      return { ok: false, error: "An account with this email already exists. Try signing in." };
    }
    const next = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      password,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, next]);
    setSession(normalized);
    return { ok: true, user: next };
  };

  const login = ({ email, password }) => {
    const normalized = email.trim().toLowerCase();
    const found = users.find((entry) => entry.email === normalized);
    if (!found || found.password !== password) {
      return { ok: false, error: "Email or password doesn't match our records." };
    }
    setSession(normalized);
    return { ok: true, user: found };
  };

  const logout = () => setSession("");

  const subscribe = (planId, cycle = "month", email = session) => {
    const plan = getPlan(planId);
    const target = String(email || "").trim().toLowerCase();
    if (!plan || (cycle !== "month" && cycle !== "year") || !target) return { ok: false };
    const startedAt = new Date();
    const renewsAt = new Date(startedAt);
    if (cycle === "year") renewsAt.setFullYear(renewsAt.getFullYear() + 1);
    else renewsAt.setMonth(renewsAt.getMonth() + 1);
    const subscription = {
      planId: plan.id,
      cycle,
      startedAt: startedAt.toISOString(),
      renewsAt: renewsAt.toISOString(),
    };
    setUsers((prev) => prev.map((entry) => (entry.email === target ? { ...entry, subscription } : entry)));
    return { ok: true, subscription, plan };
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, subscribe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
