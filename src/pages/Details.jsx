import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Play, Plus, Share2, Star } from "lucide-react";
import PosterArt from "../components/PosterArt";
import ContentRow from "../components/ContentRow";
import VideoFrame from "../components/VideoFrame";
import YouTubeFrame from "../components/YouTubeFrame";
import { Missing } from "./NotFound";
import { getRelated, getTitle, matchScore, runtimeLabel, typeLabel } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { initials } from "../utils/format";
import { glassBtn, pagePad, primaryBtn } from "../utils/styles";

const avatarTones = [
  ["#3a2a22", "#e8a87c"],
  ["#1c3332", "#7ec8c3"],
  ["#2a2440", "#b7a6f5"],
  ["#33241c", "#f0c2a0"],
];

export default function Details() {
  const { id } = useParams();
  const title = getTitle(id);
  usePageTitle(title?.title || "Title");
  const { inList, toggleList, notify, progress, saveProgress, clearProgress } = useLibrary();
  const lastSave = useRef(0);
  const related = useMemo(() => (title ? getRelated(title.id) : []), [title]);

  if (!title) {
    return (
      <Missing
        title="That title is not in the catalog"
        body="It may have been a mistyped link. The rest of the program is still on the home screen."
      />
    );
  }

  const saved = inList(title.id);
  const resumeAt = progress[title.id]?.seconds || 0;

  const showTrailer = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("trailer")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Link copied");
    } catch {
      notify("Could not copy the link");
    }
  };

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        <PosterArt title={title} variant="billboard" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        <div className={`relative z-10 flex min-h-[78vh] flex-col justify-end pb-12 pt-28 ${pagePad}`}>
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/75">
            <Link to="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to={title.type === "series" ? "/browse?type=series" : "/browse?type=movie"} className="hover:text-white">
              {title.type === "series" ? "Series" : "Movies"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-white">{title.title}</span>
          </nav>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-300">
            {title.industry} · {typeLabel(title.type)}
          </p>
          <h1 className="mt-2 max-w-3xl text-balance font-display text-5xl leading-[0.95] text-white sm:text-6xl">
            {title.title}
          </h1>
          <p className="mt-3 max-w-xl font-display text-xl tracking-tight text-white/80">{title.logline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-1 font-semibold text-tide-300">
              <Star size={14} className="fill-current" aria-hidden="true" />
              {title.rating.toFixed(1)}
            </span>
            <span>{matchScore(title)}% match</span>
            <span>{title.year}</span>
            <span className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold">{title.maturity}</span>
            <span>{runtimeLabel(title)}</span>
            <span className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold">HD</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {title.genres.map((genre) => (
              <Link
                key={genre}
                to={`/browse?genre=${encodeURIComponent(genre)}`}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                {genre}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/watch/${title.id}`} className={primaryBtn}>
              <Play size={16} className="fill-current" />
              {resumeAt > 3 ? "Resume" : "Watch"}
            </Link>
            <button type="button" onClick={showTrailer} className={glassBtn}>
              Trailer
            </button>
            <button type="button" aria-pressed={saved} onClick={() => toggleList(title)} className={glassBtn}>
              {saved ? <Check size={16} /> : <Plus size={16} />}
              {saved ? "In My List" : "My List"}
            </button>
            <button type="button" onClick={copyLink} className={glassBtn} aria-label={`Copy link to ${title.title}`}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </section>

      <section className={`grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)] ${pagePad}`}>
        <div>
          <h2 className="font-display text-3xl">Story</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{title.description}</p>
        </div>
        <dl className="grid content-start gap-4 rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] p-6">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Cinema</dt>
            <dd className="mt-1">
              <Link className="hover:text-copper-600 dark:hover:text-copper-300" to={`/browse?industry=${encodeURIComponent(title.industry)}`}>
                {title.industry}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Director</dt>
            <dd className="mt-1">
              <Link className="hover:text-copper-600 dark:hover:text-copper-300" to={`/search?q=${encodeURIComponent(title.director)}`}>
                {title.director}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Audio</dt>
            <dd className="mt-1">{title.languages.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Subtitles</dt>
            <dd className="mt-1">{title.subtitles.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Rating</dt>
            <dd className="mt-1">{title.maturity} · {title.rating.toFixed(1)} / 10</dd>
          </div>
        </dl>
      </section>

      <section id="trailer" className={`scroll-mt-24 py-4 ${pagePad}`}>
        <div className="max-w-5xl">
          <h2 className="font-display text-3xl">Trailer</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            {title.logline} This is the official trailer for {title.title}.
          </p>
          <div className="mt-5">
            {title.youtube ? (
              <YouTubeFrame videoId={title.youtube} title={title.title} />
            ) : (
              <VideoFrame
                src={title.trailer}
                poster={title.backdrop}
                title={title.title}
                startAt={resumeAt}
                autoPlay
                onProgress={(time, duration) => {
                  const now = Date.now();
                  if (now - lastSave.current < 1500) return;
                  lastSave.current = now;
                  saveProgress(title.id, time / duration, time);
                }}
                onEnded={() => clearProgress(title.id)}
              />
            )}
          </div>
        </div>
      </section>

      <section className={`py-8 ${pagePad}`}>
        <div>
          <h2 className="font-display text-3xl">Cast</h2>
          <ul className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-2">
            {title.cast.map((person, index) => {
              const tone = avatarTones[index % avatarTones.length];
              return (
                <li key={person.name} className="w-40 shrink-0">
                  <Link
                    to={`/search?q=${encodeURIComponent(person.name)}`}
                    className="group block rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-4 transition hover:-translate-y-1 hover:border-copper-400/50"
                  >
                    <span
                      className="grid h-16 w-16 place-items-center rounded-full font-display text-xl text-white"
                      style={{ background: `linear-gradient(145deg, ${tone[0]}, ${tone[1]})` }}
                    >
                      {initials(person.name)}
                    </span>
                    <span className="mt-3 block text-sm font-semibold group-hover:text-copper-700 dark:group-hover:text-copper-300">
                      {person.name}
                    </span>
                    <span className="mt-1 block text-xs text-[var(--muted)]">{person.role}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="pb-6">
        <ContentRow
          title="Related"
          items={related}
          href={`/browse?genre=${encodeURIComponent(title.genres[0])}`}
        />
      </div>
    </div>
  );
}
