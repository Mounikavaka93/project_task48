import { useId } from "react";
import { Link } from "react-router-dom";

export function LogoMark({ className = "h-9 w-9", draw = false }) {
  const raw = useId().replace(/:/g, "");
  const grad = `wickmere-${raw}`;

  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D2FF3D" />
          <stop offset="1" stopColor="#8B6CFF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="34" height="34" rx="6" fill="currentColor" fillOpacity="0.08" />
      <path
        d="M9 11 18 18 9 25"
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={draw ? "gate-stroke" : undefined}
      />
      <path
        d="M17 11 26 18 17 25"
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={draw ? "gate-stroke gate-stroke-late" : undefined}
      />
    </svg>
  );
}

export default function Logo({ tone = "theme", className = "" }) {
  const color = tone === "light" ? "text-white" : "text-[var(--text)]";
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${color} ${className}`} aria-label="Wickmere home">
      <LogoMark />
      <span className="font-display text-[1.7rem] leading-none tracking-tight">Wickmere</span>
    </Link>
  );
}
