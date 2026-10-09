import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LibraryContext = createContext(null);
const LIST_KEY = "wickmere_list";
const PROGRESS_KEY = "wickmere_progress";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function LibraryProvider({ children }) {
  const [list, setList] = useState(() => {
    const stored = readJSON(LIST_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [progress, setProgressState] = useState(() => {
    const stored = readJSON(PROGRESS_KEY, {});
    return stored && typeof stored === "object" ? stored : {};
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const notify = (message) => setToast({ id: Date.now(), message });

  const value = useMemo(() => {
    const inList = (id) => list.includes(id);
    const toggleList = (title) => {
      const saved = list.includes(title.id);
      setList((prev) => (saved ? prev.filter((id) => id !== title.id) : [title.id, ...prev]));
      notify(saved ? `Removed “${title.title}” from My List` : `Added “${title.title}” to My List`);
    };
    const saveProgress = (id, ratio, seconds) => {
      setProgressState((prev) => ({
        ...prev,
        [id]: { ratio, seconds, updatedAt: Date.now() },
      }));
    };
    const clearProgress = (id) => {
      setProgressState((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };
    return {
      list,
      progress,
      inList,
      toggleList,
      saveProgress,
      clearProgress,
      notify,
      toast,
      dismissToast: () => setToast(null),
    };
  }, [list, progress, toast]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
