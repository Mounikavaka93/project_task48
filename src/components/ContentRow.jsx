import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import Reveal from "./Reveal";
import { pagePad } from "../utils/styles";

export default function ContentRow({ title, eyebrow, items, href, ranked = false, progressOf }) {
  const scroller = useRef(null);
  const headingId = useId();
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    const update = () => {
      setEdges({
        left: el.scrollLeft > 8,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  if (!items?.length) return null;

  const scroll = (direction) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.82,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <Reveal>
      <section aria-labelledby={headingId} className="relative">
        <div className={`mb-1 flex items-end justify-between gap-4 ${pagePad}`}>
          <div>
            {eyebrow && (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">
                {eyebrow}
              </p>
            )}
            <h2 id={headingId} className="text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h2>
          </div>
          {href && (
            <Link
              to={href}
              className="shrink-0 text-sm font-medium text-copper-700 transition hover:text-copper-500 dark:text-copper-300"
            >
              See all
            </Link>
          )}
        </div>
        <div className="relative">
          {edges.left && (
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={`Scroll ${title} backward`}
              className="absolute bottom-4 left-0 top-4 z-20 hidden w-11 items-center justify-center bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent text-[var(--text)] md:flex"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {edges.right && (
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={`Scroll ${title} forward`}
              className="absolute bottom-4 right-0 top-4 z-20 hidden w-11 items-center justify-center bg-gradient-to-l from-[var(--bg)] via-[var(--bg)]/80 to-transparent text-[var(--text)] md:flex"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div
            ref={scroller}
            className={`no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto py-5 sm:gap-3 ${pagePad}`}
          >
            {items.map((item, index) => (
              <MovieCard
                key={item.id}
                title={item}
                rank={ranked ? index + 1 : undefined}
                progress={progressOf ? progressOf(item.id) : 0}
              />
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
