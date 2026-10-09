import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { surfaceBtn } from "../utils/styles";

export default function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/65 p-4" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className="menu-pop w-full max-w-lg rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] p-6 text-[var(--text)] shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="dialog-title" className="font-display text-3xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
        <button type="button" onClick={onClose} className={`${surfaceBtn} mt-6`}>
          Close
        </button>
      </div>
    </div>
  );
}
