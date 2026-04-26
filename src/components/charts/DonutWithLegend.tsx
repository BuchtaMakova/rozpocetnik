import { czk } from "../../utils";
import { DonutChart } from "./DonutChart";
import { useThemeColors } from "../../hooks/useThemeColors";

interface LegendItem { id: string; name: string; actual: number; }

export function DonutWithLegend({ title, items }: { title: string; items: LegendItem[] }) {
  const { donut: colors } = useThemeColors();
  const total = items.reduce((s, x) => s + x.actual, 0);

  return (
    <div
      className="rounded-2xl shadow-sm p-4 flex flex-col items-center gap-3"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xs font-bold uppercase tracking-widest self-start" style={{ color: "var(--color-text-muted)" }}>
        {title}
      </h3>
      <DonutChart
        segments={items.map((item, i) => ({
          label: item.name,
          value: item.actual,
          color: colors[i % colors.length],
        }))}
      />
      <div className="w-full space-y-1">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="truncate flex-1" style={{ color: "var(--color-text-base)" }}>{item.name}</span>
            <span className="font-semibold" style={{ color: "var(--color-text-muted)" }}>
              {total ? Math.round((item.actual / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
