import { useMemo } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ContentRow from "../components/ContentRow";
import Reveal from "../components/Reveal";
import { genreTones, genres, getTitle, titlesByIndustry, titlesIn } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { pagePad } from "../utils/styles";

export default function Home() {
  usePageTitle("");
  const { progress } = useLibrary();
  const trending = useMemo(() => titlesIn("trending"), []);
  const popular = useMemo(() => titlesIn("popular"), []);
  const fresh = useMemo(() => titlesIn("new"), []);
  const picks = useMemo(() => titlesIn("top"), []);
  const recommended = useMemo(() => titlesIn("recommended"), []);
  const hollywood = useMemo(() => titlesByIndustry("Hollywood"), []);
  const bollywood = useMemo(() => titlesByIndustry("Bollywood"), []);
  const tollywood = useMemo(() => titlesByIndustry("Tollywood"), []);
  const continueItems = useMemo(
    () =>
      Object.entries(progress)
        .filter(([, value]) => value?.ratio > 0.02 && value.ratio < 0.95)
        .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
        .map(([id]) => getTitle(id))
        .filter(Boolean),
    [progress],
  );

  return (
    <div>
      <Hero />
      <div className="relative z-10 -mt-8 space-y-3 pb-8 md:-mt-14 md:space-y-4">
        <ContentRow
          title="Continue Watching"
          items={continueItems}
          progressOf={(id) => progress[id]?.ratio || 0}
        />
        <ContentRow title="Top 10 on Wickmere" items={trending} href="/browse?row=trending" ranked />
        <ContentRow title="Popular" items={popular} href="/browse?row=popular" />
        <ContentRow title="Hollywood" items={hollywood} href="/browse?industry=Hollywood" />
        <ContentRow title="Bollywood" items={bollywood} href="/browse?industry=Bollywood" />
        <ContentRow title="Tollywood" items={tollywood} href="/browse?industry=Tollywood" />
        <Reveal>
          <section aria-labelledby="genre-heading" className="pt-2">
            <div className={`mb-2 ${pagePad}`}>
              <h2 id="genre-heading" className="text-lg font-semibold tracking-tight sm:text-xl">
                Genres
              </h2>
            </div>
            <div className={`no-scrollbar flex gap-2.5 overflow-x-auto pb-2 ${pagePad}`}>
              {genres.map((genre) => {
                const tone = genreTones[genre] || ["#241c18", "#e8a87c"];
                return (
                  <Link
                    key={genre}
                    to={`/browse?genre=${encodeURIComponent(genre)}`}
                    className="group relative h-[4.5rem] min-w-[9.5rem] overflow-hidden rounded-md shadow-sm ring-1 ring-white/10"
                  >
                    <span
                      className="absolute inset-0 transition duration-500 group-hover:scale-105"
                      style={{ background: `linear-gradient(145deg, ${tone[0]}, ${tone[1]})` }}
                    />
                    <span className="relative flex h-full items-end p-3 text-base font-semibold text-white">{genre}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </Reveal>
        <ContentRow title="New releases" items={fresh} href="/browse?sort=new" />
        <ContentRow title="Top rated" items={picks} href="/browse?row=top" />
        <ContentRow title="Picked for you" items={recommended} href="/browse?row=recommended" />
      </div>
    </div>
  );
}
