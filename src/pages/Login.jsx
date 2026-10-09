import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { Field, PasswordField } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { getPlan } from "../data/plans";
import { firstError, validateLogin } from "../utils/validate";
import { primaryBtn } from "../utils/styles";

const empty = { email: "", password: "" };

export default function Login() {
  const { user, login, subscribe } = useAuth();
  const { notify } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  usePageTitle("Sign in");

  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  const visible = (field) => ((submitted || touched[field]) && errors[field]) || "";

  const change = (field, value) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setFormError("");
    if (submitted || touched[field]) {
      setErrors(validateLogin(nextValues));
    }
  };

  const blur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateLogin(values));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    const first = firstError(nextErrors, ["email", "password"]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = login(values);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    const pendingPlan = getPlan(location.state?.planId);
    if (pendingPlan) subscribe(pendingPlan.id, location.state?.cycle || "month", result.user.email);
    notify(pendingPlan ? `Welcome back. ${pendingPlan.name} is saved on this device.` : `Welcome back, ${result.user.name.split(" ")[0]}.`);
    navigate(pendingPlan ? "/account" : location.state?.from || "/", { replace: true });
  };

  return (
    <AuthLayout title="Sign in" subtitle="Pick up the room where you left it. Accounts stay in this browser.">
      <form onSubmit={submit} noValidate className="grid gap-4">
        {formError && (
          <p role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {formError}
          </p>
        )}
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={80}
          placeholder="name@example.com"
          value={values.email}
          error={visible("email")}
          onBlur={() => blur("email")}
          onChange={(event) => change("email", event.target.value)}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          maxLength={64}
          placeholder="Your password"
          value={values.password}
          error={visible("password")}
          onBlur={() => blur("password")}
          onChange={(event) => change("password", event.target.value)}
        />
        <button type="submit" className={`${primaryBtn} mt-2 w-full`} disabled={submitting}>
          {submitting && <LoaderCircle size={16} className="animate-spin" />}
          {submitting ? "Signing in" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted)]">
        New to Wickmere?{" "}
        <Link to="/signup" state={location.state} className="font-semibold text-copper-700 hover:underline dark:text-copper-300">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
