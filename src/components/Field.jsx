import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass, inputError } from "../utils/styles";

export function Field({ id, label, error, className = "", ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${error ? inputError : ""} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ id, label, error, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClass} pr-12 ${error ? inputError : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--text)]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
