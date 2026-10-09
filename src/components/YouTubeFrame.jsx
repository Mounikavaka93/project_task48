export default function YouTubeFrame({ videoId, title, theater = false }) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div
      className={`relative overflow-hidden bg-black ring-1 ring-white/10 ${
        theater ? "aspect-video max-h-[82vh] w-full" : "aspect-video rounded-2xl shadow-2xl"
      }`}
    >
      <iframe
        src={src}
        title={`${title} official trailer`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
