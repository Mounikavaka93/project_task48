import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Plus } from "lucide-react";
import Logo from "../components/Logo";
import VideoFrame from "../components/VideoFrame";
import YouTubeFrame from "../components/YouTubeFrame";
import ContentRow from "../components/ContentRow";
import { Missing } from "./NotFound";
import { getRelated, getTitle, runtimeLabel, typeLabel } from "../data/catalog";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { glassBtn, pagePad } from "../utils/styles";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const title = getTitle(id);
  usePageTitle(title ? `Watch ${title.title}` : "Watch");
  const { inList, toggleList, progress, saveProgress, clearProgress } = useLibrary();
  const lastSave = useRef(0);
  const related = title ? getRelated(title.id, 12) : [];

  if (!title) {
    return (
      <Missing
        title="Nothing is queued"
        body="That watch link does not match a Wickmere title."
      />
    );
  }

  const saved = inList(title.id);

  return (
    <div>
      <div className="bg-black text-white">
        <div className={`mx-auto flex w-full max-w-[90rem] items-center justify-between gap-3 py-4 ${pagePad}`}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <Logo tone="light" />
          <Link to={`/title/${title.id}`} className="text-sm font-medium text-white/80 hover:text-white">
            Details
          </Link>
        </div>
        <div className={`mx-auto w-full max-w-[90rem] pb-10 ${pagePad}`}>
          {title.youtube ? (
            <YouTubeFrame videoId={title.youtube} title={title.title} theater />
          ) : (
            <VideoFrame
              src={title.trailer}
              poster={title.backdrop}
              title={title.title}
              startAt={progress[title.id]?.seconds || 0}
              autoPlay
              theater
              onProgress={(time, duration) => {
                const now = Date.now();
                if (now - lastSave.current < 1500) return;
                lastSave.current = now;
                saveProgress(title.id, time / duration, time);
              }}
              onEnded={() => clearProgress(title.id)}
            />
          )}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper-300">
                {typeLabel(title.type)} · {runtimeLabel(title)}
              </p>
              <h1 className="mt-2 font-display text-4xl">{title.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">{title.logline}</p>
              <p className="mt-2 max-w-2xl text-xs text-white/50">Official trailer for this title. The full film is not included.</p>
            </div>
            <button type="button" aria-pressed={saved} onClick={() => toggleList(title)} className={glassBtn}>
              {saved ? <Check size={16} /> : <Plus size={16} />}
              {saved ? "In My List" : "My List"}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[var(--bg)] py-8 text-[var(--text)]">
        <ContentRow title="More like this" items={related} />
      </div>
    </div>
  );
}
