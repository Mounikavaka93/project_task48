import { useState } from "react";

export default function PosterArt({
  title,
  variant = "poster",
  hoverZoom = false,
  imgClassName = "",
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  const src = variant === "poster" ? title.poster : title.backdrop || title.poster;
  const show = Boolean(src) && !failed;

  if (variant === "billboard") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(115deg, ${title.tone[0]}, #07080c 46%, ${title.tone[1]})` }}
        />
        {show && (
          <>
            <img
              src={src}
              alt=""
              onError={() => setFailed(true)}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-3xl ${imgClassName}`}
            />
            <img
              src={src}
              alt=""
              decoding="async"
              className="absolute bottom-[18%] right-[5%] top-[12%] hidden w-[min(32vw,360px)] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)] md:block"
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(155deg, ${title.tone[0]}, ${title.tone[1]})` }}
      />
      {show && (
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${
            hoverZoom ? "transition duration-700 ease-out md:group-hover/card:scale-105" : ""
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
