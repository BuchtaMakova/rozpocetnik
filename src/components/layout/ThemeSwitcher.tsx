import { useState, useRef, useEffect } from "react";
import { useTheme, THEMES } from "../../context/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = THEMES.find((t) => t.id === theme)!;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition"
        style={{
          background: "var(--color-surface-raised)",
          borderColor: "var(--color-border-strong)",
          color: "var(--color-text-base)",
        }}
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: current.swatch }}
        />
        {current.emoji} {current.label}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-40 rounded-xl shadow-lg border overflow-hidden z-50"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition text-left"
              style={{
                background: theme === t.id ? "var(--color-primary-subtle)" : "transparent",
                color: theme === t.id ? "var(--color-primary)" : "var(--color-text-base)",
              }}
              onMouseEnter={(e) => {
                if (theme !== t.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-accent-subtle)";
              }}
              onMouseLeave={(e) => {
                if (theme !== t.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.swatch }} />
              {t.emoji} {t.label}
              {theme === t.id && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
