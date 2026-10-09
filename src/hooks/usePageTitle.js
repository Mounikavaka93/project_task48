import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Wickmere` : "Wickmere — Cinema, closer";
    return () => {
      document.title = "Wickmere — Cinema, closer";
    };
  }, [title]);
}
