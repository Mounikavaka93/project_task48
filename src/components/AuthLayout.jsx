import { Link } from "react-router-dom";
import { getFeatured } from "../data/catalog";
import Logo from "./Logo";
import PosterArt from "./PosterArt";

export default function AuthLayout({ title, subtitle, children }) {
  const feature = getFeatured()[0];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,108,255,0.28),transparent_42%),var(--bg)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link to="/" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">
            Back home
          </Link>
        </div>
        <div className="flex flex-1 items-center py-8">
          <div className="mx-auto grid w-full max-w-lg overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-elev)]/95 shadow-2xl md:max-w-none md:grid-cols-2">
            <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-10 text-white md:flex">
              <PosterArt title={feature} variant="backdrop" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/25" />
              <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-copper-300">
                Now showing
              </p>
              <div className="relative z-10">
                <p className="font-display text-4xl leading-tight tracking-tight">Cinema, closer.</p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
                  {feature.title} is playing in the room tonight. Make an account on this browser and the list stays with you.
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <h1 className="font-display text-4xl leading-none">{title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
