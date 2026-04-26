import { SectionTable } from "../tables/SectionTable";
import { DonutChart } from "../charts/DonutChart";
import { czk } from "../../utils";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { LineItem } from "../../types";

interface SavingsTabProps {
  savings: LineItem[];
  onAdd: () => void;
  onChangePlanned: (id: string, value: number) => void;
  onChangeActual: (id: string, value: number) => void;
  onChangeName: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

export function SavingsTab({
  savings,
  onAdd,
  onChangePlanned,
  onChangeActual,
  onChangeName,
  onDelete,
}: SavingsTabProps) {
  const { donut: colors } = useThemeColors();
  const total = savings.reduce((s, x) => s + x.actual, 0);

  return (
    <div className="space-y-4">
      <SectionTable
        title="Úspory"
        items={savings}
        onAdd={onAdd}
        onChangePlanned={onChangePlanned}
        onChangeActual={onChangeActual}
        onChangeName={onChangeName}
        onDelete={onDelete}
        invertedResults={true}
      />
      <div
        className="rounded-2xl shadow-sm p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          Rozložení úspor
        </h3>
        <div className="flex items-center gap-6 flex-wrap">
          <DonutChart
            segments={savings.map((s, i) => ({
              label: s.name,
              value: s.actual,
              color: colors[i % colors.length],
            }))}
          />
          <div className="space-y-1.5">
            {savings.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: colors[i % colors.length] }}
                />
                <span style={{ color: "var(--color-text-base)" }}>
                  {s.name}
                </span>
                <span
                  className="font-semibold ml-auto pl-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {czk(s.actual)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  ({total ? Math.round((s.actual / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
