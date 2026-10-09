import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { primaryBtn } from "../utils/styles";

export function Missing({ title, body }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-4 py-28">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Wickmere</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      <Link to="/" className={`${primaryBtn} mt-6`}>
        Back to the program
      </Link>
    </div>
  );
}

export default function NotFound() {
  usePageTitle("Not found");
  return (
    <Missing
      title="This page is off the program"
      body="The link may be old, or that title never landed in the Wickmere catalog."
    />
  );
}
