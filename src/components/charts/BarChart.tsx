import { czk } from "../../utils";

interface BarRow { label: string; planned: number; actual: number; }

export function BarChart({ rows }: { rows: BarRow[] }) {
  const max = Math.max(...rows.flatMap((r) => [r.planned, r.actual]), 1);

  return (
    <div className="flex flex-col gap-3 w-full">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="text-xs font-medium w-20 truncate" style={{ color: "var(--color-text-muted)" }}>
            {row.label}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div
                style={{ width: `${(row.planned / max) * 100}%`, background: "var(--color-bar-planned)" }}
                className="h-2 rounded min-w-[2px] transition-all duration-500"
              />
              <span className="text-[10px]" style={{ color: "var(--color-text-faint)" }}>{czk(row.planned)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                style={{
                  width: `${(row.actual / max) * 100}%`,
                  background: row.actual > row.planned ? "var(--color-danger)" : "var(--color-bar-actual)",
                }}
                className="h-2 rounded min-w-[2px] transition-all duration-500"
              />
              <span className="text-[10px]" style={{ color: "var(--color-primary-light)" }}>{czk(row.actual)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
