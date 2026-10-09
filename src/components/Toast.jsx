import { X } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";

export default function Toast() {
  const { toast, dismissToast } = useLibrary();
  if (!toast) return null;

  return (
    <div
      className="menu-pop fixed bottom-4 left-1/2 z-[80] w-[min(92vw,440px)] -translate-x-1/2"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] px-4 py-3 text-sm text-[var(--text)] shadow-2xl">
        <p>{toast.message}</p>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-[var(--bg)]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
