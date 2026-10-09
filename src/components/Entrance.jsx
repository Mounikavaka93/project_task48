import { useEffect, useState } from "react";
import { getFeatured } from "../data/catalog";
import { LogoMark } from "./Logo";

const GATE_KEY = "wickmere_gate";
const WORD = "Wickmere";
const posters = getFeatured().slice(0, 5);
const spots = [
  { left: "7%", top: "16%", tilt: "-8deg", delay: "2.1s" },
  { left: "18%", top: "58%", tilt: "6deg", delay: "2.35s" },
  { right: "8%", top: "14%", tilt: "7deg", delay: "2.2s" },
  { right: "16%", top: "60%", tilt: "-5deg", delay: "2.5s" },
  { left: "42%", top: "8%", tilt: "2deg", delay: "2.65s" },
];

export default function Entrance() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [open, setOpen] = useState(() => sessionStorage.getItem(GATE_KEY) !== "1");
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(reduce);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open || reduce) return undefined;
    const id = setTimeout(() => setReady(true), 3200);
    return () => clearTimeout(id);
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" || (event.key === "Enter" && ready)) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ready]);

  const close = () => {
    if (leaving) return;
    sessionStorage.setItem(GATE_KEY, "1");
    if (reduce) {
      setOpen(false);
      return;
    }
    setLeaving(true);
    setTimeout(() => setOpen(false), 880);
  };

  if (!open) return null;

  return (
    <div className={`gate ${leaving ? "gate-out" : ""} ${reduce ? "gate-still" : ""}`} role="dialog" aria-modal="true" aria-label="Enter Wickmere">
      <div className="gate-grain" aria-hidden="true" />
      <div className="gate-vignette" aria-hidden="true" />
      <div className="gate-beam" aria-hidden="true" />
      <div className="gate-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="gate-sprocket gate-sprocket-left" aria-hidden="true" />
      <div className="gate-sprocket gate-sprocket-right" aria-hidden="true" />

      <ul className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {posters.map((title, index) => (
          <li
            key={title.id}
            className="gate-card absolute h-40 w-28 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20"
            style={{
              ...spots[index],
              "--tilt": spots[index].tilt,
              animationDelay: spots[index].delay,
            }}
          >
            {title.poster ? (
              <img src={title.poster} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="block h-full w-full" style={{ background: `linear-gradient(160deg, ${title.tone[0]}, ${title.tone[1]})` }} />
            )}
          </li>
        ))}
      </ul>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        <LogoMark draw={!reduce} className="gate-mark h-16 w-16 text-white" />
        <h1 className="mt-5 font-display text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
          {WORD.split("").map((letter, index) => (
            <span key={`${letter}-${index}`} className="gate-letter" style={{ animationDelay: `${1.35 + index * 0.07}s` }}>
              {letter}
            </span>
          ))}
        </h1>
        <p className="gate-line mt-4 font-display text-xl tracking-tight text-copper-300 sm:text-2xl">Cinema, closer</p>
        <p className="gate-line gate-line-late mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
          Hollywood · Bollywood · Tollywood
        </p>
        <button
          type="button"
          onClick={close}
          className={`gate-enter mt-8 inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85 ${ready ? "gate-enter-on" : ""}`}
        >
          Enter the room
        </button>
      </div>

      <button type="button" onClick={close} className="absolute right-4 top-4 z-20 rounded-full px-3 py-1.5 text-xs font-medium text-white/70 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white">
        Skip
      </button>
    </div>
  );
}
