import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Info, Pause, Play, Plus, Star } from "lucide-react";
import { getFeatured, runtimeLabel } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import PosterArt from "./PosterArt";
import { glassBtn, pagePad } from "../utils/styles";

export default function Hero() {
  const slides = useMemo(() => getFeatured(), []);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const touchX = useRef(null);
  const paused = userPaused || hovering;
  const { inList, toggleList } = useLibrary();
  const current = slides[index];
  const saved = current ? inList(current.id) : false;

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (!current) return null;

  const go = (direction) => setIndex((value) => (value + direction + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured titles"
      className="relative min-h-[82vh] overflow-hidden md:min-h-[88vh]"
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) return;
        const delta = event.changedTouches[0].clientX - touchX.current;
        if (delta > 48) go(-1);
        if (delta < -48) go(1);
        touchX.current = null;
      }}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
        >
          <PosterArt
            title={slide}
            variant="billboard"
            priority={slideIndex === 0}
            imgClassName={slideIndex === index ? "animate-kenburns" : ""}
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className={`relative z-10 flex min-h-[82vh] flex-col justify-end pb-24 pt-28 md:min-h-[88vh] md:pb-32 ${pagePad}`}>
        <div key={current.id} className="hero-copy max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper-300">
            {current.industry} · {current.languages[0]} · {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
          <h1 className="mt-3 max-w-xl text-balance font-display text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl">
            {current.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-1 font-semibold text-tide-300">
              <Star size={14} className="fill-current" aria-hidden="true" />
              {current.rating.toFixed(1)}
            </span>
            <span>{current.year}</span>
            <span className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold">{current.maturity}</span>
            <span>{runtimeLabel(current)}</span>
            <span className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold">HD</span>
          </div>
          <p className="mt-3 text-sm text-white/75">{current.genres.join(" · ")}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{current.logline}</p>
          <p className="mt-2 line-clamp-2 hidden max-w-xl text-sm leading-relaxed text-white/70 sm:line-clamp-3 sm:block">{current.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`/watch/${current.id}`} className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85">
              <Play size={18} className="fill-current" />
              Play
            </Link>
            <Link to={`/title/${current.id}`} className={glassBtn}>
              <Info size={16} />
              More info
            </Link>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => toggleList(current)}
              className={glassBtn}
            >
              {saved ? <Check size={16} /> : <Plus size={16} />}
              {saved ? "In My List" : "My List"}
            </button>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous featured title"
              className="hidden h-9 w-9 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur md:grid"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setUserPaused((value) => !value)}
              aria-label={userPaused ? "Resume featured rotation" : "Pause featured rotation"}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur"
            >
              {userPaused ? <Play size={14} className="fill-current" /> : <Pause size={14} />}
            </button>
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.title}`}
                aria-current={slideIndex === index}
                onClick={() => setIndex(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${slideIndex === index ? "w-8 bg-copper-400" : "w-3 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next featured title"
              className="hidden h-9 w-9 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur md:grid"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
