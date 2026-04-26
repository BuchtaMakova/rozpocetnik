import { SectionTable } from "../tables/SectionTable";
import { DonutChart } from "../charts/DonutChart";
import { czk } from "../../utils";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { LineItem } from "../../types";

interface ExpensesTabProps {
  expenses: LineItem[];
  onAdd: () => void;
  onChangePlanned: (id: string, value: number) => void;
  onChangeActual: (id: string, value: number) => void;
  onChangeName: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTab({
  expenses,
  onAdd,
  onChangePlanned,
  onChangeActual,
  onChangeName,
  onDelete,
}: ExpensesTabProps) {
  const { donut: colors } = useThemeColors();
  const total = expenses.reduce((s, x) => s + x.actual, 0);

  return (
    <div className="space-y-4">
      <SectionTable
        title="Výdaje"
        items={expenses}
        onAdd={onAdd}
        onChangePlanned={onChangePlanned}
        onChangeActual={onChangeActual}
        onChangeName={onChangeName}
        onDelete={onDelete}
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
          Rozložení výdajů
        </h3>
        <div className="flex items-center gap-6 flex-wrap">
          <DonutChart
            segments={expenses.map((e, i) => ({
              label: e.name,
              value: e.actual,
              color: colors[i % colors.length],
            }))}
          />
          <div className="space-y-1.5">
            {expenses.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: colors[i % colors.length] }}
                />
                <span style={{ color: "var(--color-text-base)" }}>
                  {e.name}
                </span>
                <span
                  className="font-semibold ml-auto pl-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {czk(e.actual)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  ({total ? Math.round((e.actual / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
