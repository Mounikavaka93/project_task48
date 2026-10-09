import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Check, Circle, LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { Field, PasswordField } from "../components/Field";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { getPlan } from "../data/plans";
import { firstError, passwordRules, passwordStrength, validateSignup } from "../utils/validate";
import { primaryBtn } from "../utils/styles";

const empty = { name: "", email: "", password: "", confirm: "", terms: false };

export default function Signup() {
  const { user, signup, subscribe } = useAuth();
  const { notify } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  usePageTitle("Create account");

  if (user) return <Navigate to="/" replace />;

  const rules = passwordRules(values.password);
  const strength = passwordStrength(values.password);
  const strengthColor = ["bg-[var(--line)]", "bg-rose-500", "bg-amber-500", "bg-tide-500", "bg-emerald-500"][strength.met];

  const visible = (field) => ((submitted || touched[field]) && errors[field]) || "";

  const revalidate = (nextValues, field) => {
    if (!(submitted || touched[field] || (field === "password" && touched.confirm))) return;
    setErrors(validateSignup(nextValues));
  };

  const change = (field, value) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setFormError("");
    revalidate(nextValues, field);
  };

  const blur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateSignup(values));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    const first = firstError(nextErrors, ["name", "email", "password", "confirm", "terms"]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const result = signup(values);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      document.getElementById("email")?.focus();
      return;
    }
    const pendingPlan = getPlan(location.state?.planId);
    if (pendingPlan) subscribe(pendingPlan.id, location.state?.cycle || "month", result.user.email);
    notify(pendingPlan ? `Welcome. ${pendingPlan.name} is saved on this device.` : `Welcome to Wickmere, ${result.user.name.split(" ")[0]}.`);
    navigate(pendingPlan ? "/account" : "/", { replace: true });
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="A name, an email, and a password. Nothing leaves this browser."
    >
      <form onSubmit={submit} noValidate className="grid gap-4">
        {formError && (
          <p role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {formError}
          </p>
        )}
        <Field
          id="name"
          label="Name"
          autoComplete="name"
          maxLength={50}
          placeholder="Your name"
          value={values.name}
          error={visible("name")}
          onBlur={() => blur("name")}
          onChange={(event) => change("name", event.target.value)}
        />
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
        <div>
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            maxLength={64}
            placeholder="Create a password"
            value={values.password}
            error={visible("password")}
            onBlur={() => blur("password")}
            onChange={(event) => change("password", event.target.value)}
          />
          <div className="mt-3" aria-live="polite">
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <span key={index} className={`h-1 flex-1 rounded-full ${index < strength.met ? strengthColor : "bg-[var(--line)]"}`} />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-[var(--muted)]">{strength.label}</p>
            <ul className="mt-2 grid gap-1">
              {rules.map((rule) => (
                <li key={rule.id} className={`flex items-center gap-2 text-xs ${rule.ok ? "text-emerald-700 dark:text-emerald-300" : "text-[var(--muted)]"}`}>
                  {rule.ok ? <Check size={13} /> : <Circle size={13} />}
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PasswordField
          id="confirm"
          label="Confirm password"
          autoComplete="new-password"
          maxLength={64}
          placeholder="Repeat your password"
          value={values.confirm}
          error={visible("confirm")}
          onBlur={() => blur("confirm")}
          onChange={(event) => change("confirm", event.target.value)}
        />
        <div>
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={values.terms}
              onChange={(event) => change("terms", event.target.checked)}
              onBlur={() => blur("terms")}
              className="mt-1 h-4 w-4 accent-copper-500"
              aria-invalid={visible("terms") ? "true" : "false"}
              aria-describedby={visible("terms") ? "terms-error" : undefined}
            />
            <label htmlFor="terms" className="text-sm leading-relaxed text-[var(--muted)]">
              I agree to the Wickmere viewer terms and understand this demo keeps my account on this device.
            </label>
          </div>
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="mt-2 text-sm font-semibold text-copper-700 hover:underline dark:text-copper-300"
          >
            Read the terms
          </button>
          {visible("terms") && (
            <p id="terms-error" className="mt-1.5 text-sm text-rose-700 dark:text-rose-300">
              {visible("terms")}
            </p>
          )}
        </div>
        <button type="submit" className={`${primaryBtn} w-full`} disabled={submitting}>
          {submitting && <LoaderCircle size={16} className="animate-spin" />}
          {submitting ? "Creating account" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-copper-700 hover:underline dark:text-copper-300">
          Sign in
        </Link>
      </p>
      <Modal open={termsOpen} title="Viewer terms" onClose={() => setTermsOpen(false)}>
        <p>
          Wickmere is a demonstration streaming interface. Film and series names are real. Play opens that title’s
          official trailer. Full films are not included.
        </p>
        <p className="mt-3">
          Your name, email, and password are stored in this browser so you can sign back in. They are not sent to a
          server. My List and watch progress stay on the device as well.
        </p>
      </Modal>
    </AuthLayout>
  );
}
