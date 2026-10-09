import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { formatTime } from "../utils/format";

export default function VideoFrame({
  src,
  poster,
  title,
  startAt = 0,
  autoPlay = false,
  onProgress,
  onEnded,
  theater = false,
}) {
  const videoRef = useRef(null);
  const shellRef = useRef(null);
  const sought = useRef(false);
  const hideTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [controls, setControls] = useState(true);
  const [full, setFull] = useState(false);

  const revealControls = () => {
    setControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControls(false);
    }, 2600);
  };

  const seekOnce = (element) => {
    if (sought.current || startAt <= 3 || !element.duration) return;
    element.currentTime = Math.min(startAt, Math.max(element.duration - 0.5, 0));
    sought.current = true;
  };

  const play = (withSound) => {
    const element = videoRef.current;
    if (!element) return;
    setFailed(false);
    if (withSound) {
      element.muted = false;
      setMuted(false);
    }
    seekOnce(element);
    const pending = element.play();
    if (!pending) return;
    pending
      .then(() => setPlaying(true))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        if (!withSound) return;
        element.muted = true;
        setMuted(true);
        element
          .play()
          .then(() => setPlaying(true))
          .catch((retryError) => {
            if (retryError?.name !== "AbortError" && retryError?.name !== "NotAllowedError") setFailed(true);
          });
      });
  };

  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    if (!autoPlay) return undefined;
    const element = videoRef.current;
    if (!element) return undefined;
    element.muted = true;
    setMuted(true);
    const begin = () => playRef.current(false);
    if (element.readyState >= 1) begin();
    else element.addEventListener("loadedmetadata", begin, { once: true });
    return () => clearTimeout(hideTimer.current);
  }, [autoPlay, src]);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) play(true);
    else {
      element.pause();
      setPlaying(false);
      setControls(true);
    }
  };

  const toggleMute = () => {
    const element = videoRef.current;
    if (!element) return;
    const next = !element.muted;
    element.muted = next;
    if (!next && element.volume === 0) {
      element.volume = 1;
      setVolume(1);
    }
    setMuted(next);
  };

  const toggleFull = async () => {
    const shell = shellRef.current;
    if (!shell) return;
    if (document.fullscreenElement === shell) await document.exitFullscreen();
    else await shell.requestFullscreen();
  };

  const onKey = (event) => {
    const element = videoRef.current;
    if (!element) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      toggle();
    } else if (event.key === "f") {
      event.preventDefault();
      toggleFull();
    } else if (event.key === "m") {
      event.preventDefault();
      toggleMute();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      element.currentTime = Math.min(element.duration || 0, element.currentTime + 5);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      element.currentTime = Math.max(0, element.currentTime - 5);
    }
  };

  return (
    <div
      ref={shellRef}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && setControls(false)}
      onClick={toggle}
      className={`group/player relative overflow-hidden bg-black outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-copper-400 ${
        theater ? "aspect-video max-h-[82vh] w-full" : "aspect-video rounded-2xl shadow-2xl"
      }`}
      aria-label={`Player for ${title}`}
    >
      {failed ? (
        <div
          className="flex h-full flex-col items-center justify-center gap-4 bg-cover bg-center px-6 text-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url(${poster})` }}
          onClick={(event) => event.stopPropagation()}
        >
          <p className="max-w-md text-sm text-white">This title couldn’t start. Check the connection and try again.</p>
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              const element = videoRef.current;
              if (element) element.load();
              play(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950"
          >
            <RotateCcw size={16} />
            Try again
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="auto"
          className="h-full w-full bg-black object-contain"
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || 0);
            seekOnce(event.currentTarget);
          }}
          onTimeUpdate={(event) => {
            const element = event.currentTarget;
            setTime(element.currentTime || 0);
            if (!element.duration || Number.isNaN(element.duration)) return;
            onProgress?.(element.currentTime, element.duration);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => {
            setBuffering(false);
            setPlaying(true);
          }}
          onEnded={() => {
            setPlaying(false);
            setControls(true);
            onEnded?.();
          }}
          onError={() => {
            const code = videoRef.current?.error?.code;
            if (code && code !== 1) setFailed(true);
          }}
        />
      )}

      {!failed && !playing && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            play(true);
          }}
          className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-t from-black/70 via-black/20 to-black/30"
          aria-label={`Play ${title}`}
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-copper-400 text-ink-950 shadow-glow transition hover:scale-105">
            <Play size={28} className="ml-1 fill-current" />
          </span>
        </button>
      )}

      {muted && playing && !failed && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            play(true);
          }}
          className="absolute left-3 top-3 z-30 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur"
        >
          Sound on
        </button>
      )}

      {buffering && playing && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}

      {!failed && (
        <div
          onClick={(event) => event.stopPropagation()}
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/75 to-transparent px-3 pb-3 pt-12 text-white transition duration-300 sm:px-4 ${
            controls || !playing ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            aria-label="Seek"
            onChange={(event) => {
              const next = Number(event.target.value);
              if (videoRef.current) videoRef.current.currentTime = next;
              setTime(next);
            }}
            className="mb-2 h-1 w-full cursor-pointer accent-copper-400"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15">
              {playing ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
            </button>
            <span className="min-w-[88px] text-xs tabular-nums text-white/85">
              {formatTime(time)} / {formatTime(duration)}
            </span>
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15">
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(event) => {
                const next = Number(event.target.value);
                setVolume(next);
                if (videoRef.current) {
                  videoRef.current.volume = next;
                  videoRef.current.muted = next === 0;
                }
                setMuted(next === 0);
              }}
              className="hidden h-1 w-20 cursor-pointer accent-copper-400 sm:block"
            />
            <span className="ml-auto truncate text-xs text-white/70 sm:text-sm">{title}</span>
            <button type="button" onClick={toggleFull} aria-label={full ? "Exit full screen" : "Full screen"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/15">
              {full ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
