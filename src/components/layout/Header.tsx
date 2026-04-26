import { MONTHS_CZ } from "../../constants";
import type { MonthData, TabId } from "../../types";
import { exportToExcel } from "../../utils/exportExcel";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HeaderProps {
  month: number;
  year: number;
  data?: MonthData | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Přehled" },
  { id: "income", label: "Příjem" },
  { id: "fixed", label: "Fixní náklady" },
  { id: "expenses", label: "Výdaje" },
  { id: "savings", label: "Úspory" },
];

export function Header({
  month,
  year,
  data,
  onPrevMonth,
  onNextMonth,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md shadow-sm"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 85%, transparent)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg shadow"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-light), var(--color-primary))",
            }}
          >
            👮‍♂️
          </div>
          <div>
            <div
              className="font-black text-lg leading-tight tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              RozpoČetník
            </div>
          </div>
        </div>

        {/* Month navigator */}
        <div className="flex items-center gap-2">
          <NavButton onClick={onPrevMonth}>‹</NavButton>
          <div className="text-center min-w-[120px]">
            <div
              className="font-bold"
              style={{ color: "var(--color-text-base)" }}
            >
              {MONTHS_CZ[month]}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {year}
            </div>
          </div>
          <NavButton onClick={onNextMonth}>›</NavButton>
        </div>

        {/* Export & Theme */}
        <div className="flex items-center gap-2">
          {data && (
            <button
              onClick={() => exportToExcel(data)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
              style={{
                background: "var(--color-accent-light)",
                color: "var(--color-text-strong)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "0.8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "1")
              }
              title="Stáhnout jako Excel"
            >
              📥 Excel
            </button>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

function NavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition"
      style={{
        border: "1px solid var(--color-border-strong)",
        color: "var(--color-primary)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background =
          "var(--color-primary-subtle)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
    >
      {children}
    </button>
  );
}
