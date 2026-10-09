import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useLibrary } from "../context/LibraryContext";
import { validateEmailOnly } from "../utils/validate";
import { pagePad, primaryBtn } from "../utils/styles";

const year = new Date().getFullYear();

export default function Footer() {
  const { notify } = useLibrary();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const message = validateEmailOnly(email);
    setError(message);
    if (message) return;
    setEmail("");
    notify("Noted on this device only. Wickmere does not send email.");
  };

  return (
    <footer className="mt-8 border-t border-[var(--line)] bg-[var(--bg-elev)]">
      <div className={`grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 ${pagePad}`}>
        <div className="md:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            Hollywood, Bollywood, and Tollywood in one screening room. Each title opens its own official trailer.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Watch</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/">Home</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/browse?type=movie">Movies</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/browse?type=series">Series</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/browse?sort=new">New releases</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Library</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/list">My List</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/plans">Plans</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/account">Account</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/login">Sign in</Link></li>
            <li><Link className="hover:text-copper-600 dark:hover:text-copper-300" to="/signup">Create account</Link></li>
          </ul>
        </div>
        <form onSubmit={submit}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Stay close</p>
          <p className="mt-3 text-sm text-[var(--muted)]">A local note only. Nothing is sent anywhere.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              placeholder="name@example.com"
              aria-label="Email address"
              aria-invalid={error ? "true" : "false"}
              className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-copper-400"
            />
            <button type="submit" className={primaryBtn}>
              Notify me
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        </form>
      </div>
      <div className={`flex flex-col gap-2 border-t border-[var(--line)] py-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between ${pagePad}`}>
        <p>© {year} Wickmere. Real titles, original interface.</p>
        <p>Playback is the official trailer for that title, not the full film.</p>
      </div>
    </footer>
  );
}
