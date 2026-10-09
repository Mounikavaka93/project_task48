const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}][\p{L}\s'.-]{0,49}$/u;

export function passwordRules(password) {
  return [
    { id: "length", ok: password.length >= 8, label: "At least 8 characters" },
    { id: "upper", ok: /[A-Z]/.test(password), label: "One uppercase letter" },
    { id: "lower", ok: /[a-z]/.test(password), label: "One lowercase letter" },
    { id: "number", ok: /\d/.test(password), label: "One number" },
  ];
}

export function passwordStrength(password) {
  const met = passwordRules(password).filter((rule) => rule.ok).length;
  if (!password) return { met, label: "Enter a password" };
  if (met <= 1) return { met, label: "Too weak" };
  if (met === 2) return { met, label: "Fair" };
  if (met === 3) return { met, label: "Almost there" };
  return { met, label: "Strong" };
}

export function validateLogin(values) {
  const errors = {};
  const email = values.email.trim();
  if (!email) errors.email = "Enter your email.";
  else if (!emailPattern.test(email)) errors.email = "Enter an email like name@example.com.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

export function validateSignup(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Name should be at least 2 characters.";
  else if (!namePattern.test(name)) errors.name = "Use letters, spaces, hyphens, or apostrophes.";

  if (!email) errors.email = "Enter your email.";
  else if (!emailPattern.test(email)) errors.email = "Enter an email like name@example.com.";

  if (!values.password) errors.password = "Create a password.";
  else {
    const failed = passwordRules(values.password).find((rule) => !rule.ok);
    if (failed) errors.password = `Password needs: ${failed.label.toLowerCase()}.`;
  }

  if (!values.confirm) errors.confirm = "Confirm your password.";
  else if (values.confirm !== values.password) errors.confirm = "Those passwords don't match.";

  if (!values.terms) errors.terms = "Accept the terms to create an account.";
  return errors;
}

export function validateEmailOnly(email) {
  const value = email.trim();
  if (!value) return "Enter your email.";
  if (!emailPattern.test(value)) return "Enter an email like name@example.com.";
  return "";
}

export function firstError(errors, order) {
  return order.find((key) => errors[key]);
}
