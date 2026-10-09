import { Link } from "react-router-dom";
import TitleGrid from "../components/TitleGrid";
import { getTitle } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { pagePad, primaryBtn } from "../utils/styles";

export default function MyList() {
  usePageTitle("My List");
  const { list } = useLibrary();
  const titles = list.map((id) => getTitle(id)).filter(Boolean);

  return (
    <div className={`${pagePad} pb-16 pt-24 sm:pt-28`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Library</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">My List</h1>
      <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
        Saved on this browser. Add a title from any card, the banner, or its page.
      </p>
      {titles.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <h2 className="font-display text-3xl">Your list is quiet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
            Browse the catalog and keep the stories you want for later.
          </p>
          <Link to="/browse" className={`${primaryBtn} mt-6`}>
            Browse titles
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <TitleGrid titles={titles} />
        </div>
      )}
    </div>
  );
}
