import { Link } from "react-router-dom";
import { Check, Info, Play, Plus, Star } from "lucide-react";
import { matchScore, typeLabel } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import PosterArt from "./PosterArt";

export default function MovieCard({ title, layout = "rail", rank, progress = 0 }) {
  const { inList, toggleList } = useLibrary();
  const saved = inList(title.id);
  const rail = layout === "rail";
  const width = rail
    ? rank
      ? "w-[78vw] shrink-0 snap-start sm:w-[280px]"
      : "w-[40vw] shrink-0 snap-start sm:w-[168px] lg:w-[188px]"
    : "w-full";

  return (
    <article className={`group/card relative ${width}`}>
      {rank && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 left-0 z-0 select-none font-display text-[5.25rem] font-semibold leading-none text-transparent sm:text-[6.5rem]"
          style={{ WebkitTextStroke: "1.5px var(--text)" }}
        >
          {rank}
        </span>
      )}
      <div
        className={`relative overflow-hidden rounded-md bg-black shadow-md ring-1 ring-white/10 transition duration-300 md:group-hover/card:z-20 md:group-hover/card:scale-[1.06] md:group-hover/card:shadow-2xl ${
          rank ? "ml-8 sm:ml-10" : ""
        }`}
      >
        <div className="relative aspect-[2/3]">
          <PosterArt title={title} hoverZoom />
          <Link
            to={`/title/${title.id}`}
            className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-400"
            aria-label={`${title.title}, ${title.industry || typeLabel(title.type)}, rated ${title.rating.toFixed(1)}`}
          >
            <span className="sr-only">{title.title}</span>
          </Link>
          <div className="pointer-events-none absolute left-2 top-2 z-20 inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            <Star size={11} className="fill-copper-300 text-copper-300" aria-hidden="true" />
            {title.rating.toFixed(1)}
          </div>
          {title.year >= 2025 && (
            <span className="pointer-events-none absolute right-2 top-2 z-20 rounded bg-copper-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950">
              New
            </span>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent p-2.5 pt-12 transition duration-200 md:group-hover/card:opacity-0">
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">{title.title}</h3>
            <p className="mt-0.5 text-[11px] text-white/70">{title.industry || typeLabel(title.type)}</p>
          </div>
          <div className="pointer-events-none absolute inset-0 z-20 hidden flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent p-3 opacity-0 transition duration-200 md:flex md:group-hover/card:opacity-100">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{title.title}</h3>
            <p className="mt-1 text-[11px] text-white/75">
              {title.industry || typeLabel(title.type)} · {title.year}
            </p>
            <p className="mt-1 line-clamp-1 text-[11px] text-white/80">{title.genres.join(" · ")}</p>
            <p className="mt-1 text-[11px] font-medium text-tide-300">{matchScore(title)}% match</p>
            <div className="pointer-events-auto relative z-30 mt-2 flex gap-1.5">
              <Link
                to={`/watch/${title.id}`}
                aria-label={`Watch ${title.title}`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-black transition hover:bg-white/85"
              >
                <Play size={14} className="fill-current" />
              </Link>
              <button
                type="button"
                aria-pressed={saved}
                aria-label={saved ? `Remove ${title.title} from My List` : `Add ${title.title} to My List`}
                onClick={() => toggleList(title)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 transition hover:bg-white/25"
              >
                {saved ? <Check size={14} /> : <Plus size={14} />}
              </button>
              <Link
                to={`/title/${title.id}`}
                aria-label={`Details for ${title.title}`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 transition hover:bg-white/25"
              >
                <Info size={14} />
              </Link>
            </div>
          </div>
          {progress > 0.02 && progress < 0.98 && (
            <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/25" aria-hidden="true">
              <div className="h-full bg-copper-400" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
