import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TitleGrid from "../components/TitleGrid";
import { genres, industries, queryTitles } from "../data/catalog";
import { usePageTitle } from "../hooks/usePageTitle";
import { pagePad, surfaceBtn } from "../utils/styles";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "rating", label: "Top rated" },
  { id: "title", label: "A–Z" },
];

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-copper-400 text-ink-950"
          : "border border-[var(--line)] bg-[var(--bg-elev)] hover:border-copper-400/60"
      }`}
    >
      {children}
    </button>
  );
}

function headingFor({ type, genre, industry, sort, row }) {
  if (genre && industry) return `${genre} · ${industry}`;
  if (genre && type === "movie") return `${genre} movies`;
  if (genre && type === "series") return `${genre} series`;
  if (genre) return genre;
  if (industry && type === "movie") return `${industry} movies`;
  if (industry && type === "series") return `${industry} series`;
  if (industry) return industry;
  if (type === "movie") return "Movies";
  if (type === "series") return "Series";
  if (sort === "new") return "New releases";
  if (row === "trending") return "Top 10 on Wickmere";
  if (row === "popular") return "Popular";
  if (row === "top") return "Top rated";
  if (row === "recommended") return "Picked for you";
  return "Browse";
}

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "";
  const genre = params.get("genre") || "";
  const industry = params.get("industry") || "";
  const sort = params.get("sort") || "";
  const row = params.get("row") || "";
  const heading = headingFor({ type, genre, industry, sort, row });
  usePageTitle(heading);

  const results = useMemo(
    () => queryTitles({ type, genre, industry, sort, row }),
    [type, genre, industry, sort, row],
  );

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || value === "featured") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const filtered = Boolean(type || genre || industry || sort || row);

  return (
    <div className={`${pagePad} pb-16 pt-24 sm:pt-28`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Catalog</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl">{heading}</h1>
        <p className="text-sm text-[var(--muted)]">
          {results.length} {results.length === 1 ? "title" : "titles"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Chip active={!type} onClick={() => update("type", "all")}>All</Chip>
          <Chip active={type === "movie"} onClick={() => update("type", "movie")}>Movies</Chip>
          <Chip active={type === "series"} onClick={() => update("type", "series")}>Series</Chip>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Chip active={!industry} onClick={() => update("industry", "all")}>All cinemas</Chip>
          {industries.map((item) => (
            <Chip key={item} active={industry === item} onClick={() => update("industry", item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Chip active={!genre} onClick={() => update("genre", "all")}>Any genre</Chip>
          {genres.map((item) => (
            <Chip key={item} active={genre === item} onClick={() => update("genre", item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-[var(--muted)]" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={sort || "featured"}
            onChange={(event) => update("sort", event.target.value)}
            className="rounded-full border border-[var(--line)] bg-[var(--bg-elev)] px-4 py-2 text-sm outline-none focus:border-copper-400"
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {filtered && (
            <button type="button" className={surfaceBtn} onClick={() => setParams(new URLSearchParams())}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <h2 className="font-display text-3xl">No titles in this cut</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
            Try another genre, or clear the filters to see the full Wickmere catalog.
          </p>
          <button type="button" className={`${surfaceBtn} mt-6`} onClick={() => setParams(new URLSearchParams())}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <TitleGrid titles={results} />
        </div>
      )}
    </div>
  );
}
