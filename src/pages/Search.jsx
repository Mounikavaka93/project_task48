import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import TitleGrid from "../components/TitleGrid";
import { searchCatalog } from "../data/catalog";
import { usePageTitle } from "../hooks/usePageTitle";
import { inputClass, pagePad } from "../utils/styles";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  usePageTitle(q ? `Search “${q}”` : "Search");
  const results = useMemo(() => searchCatalog(q), [q]);

  const onChange = (event) => {
    const next = event.target.value;
    setParams(next.trim() ? { q: next } : {}, { replace: true });
  };

  return (
    <div className={`${pagePad} pb-16 pt-24 sm:pt-28`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Search</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Find a story</h1>
      <label className="relative mt-6 block max-w-2xl">
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={q}
          onChange={onChange}
          placeholder="Titles, genres, directors, or cast"
          aria-label="Search the catalog"
          className={`${inputClass} pl-11`}
        />
      </label>
      <p className="mt-4 text-sm text-[var(--muted)]">
        {q
          ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${q}”`
          : "Try RRR, Oppenheimer, Action, or Tollywood."}
      </p>
      {!q ? null : results.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <h2 className="font-display text-3xl">Nothing matched</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
            Check the spelling, or search a genre such as Action, Drama, or Thriller.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <TitleGrid titles={results} />
        </div>
      )}
    </div>
  );
}
