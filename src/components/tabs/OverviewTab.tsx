import { BarChart } from "../charts/BarChart";
import { DonutWithLegend } from "../charts/DonutWithLegend";
import { czk } from "../../utils";
import type { MonthData } from "../../types";

interface OverviewTabProps {
  data: MonthData;
  totalPlannedIncome: number;
  totalActualIncome: number;
  incomeDiff: number;
  totalFixed: number;
  totalFixedPlanned: number;
  totalExpenses: number;
  totalExpensesPlanned: number;
  totalSavings: number;
  totalSavingsPlanned: number;
  balance: number;
  plannedBalance: number;
}

export function OverviewTab({
  data,
  totalPlannedIncome,
  totalActualIncome,
  incomeDiff,
  totalFixed,
  totalFixedPlanned,
  totalExpenses,
  totalExpensesPlanned,
  totalSavings,
  totalSavingsPlanned,
  balance,
  plannedBalance,
}: OverviewTabProps) {
  const kpis = [
    {
      label: "Příjem",
      planned: totalPlannedIncome,
      actual: totalActualIncome,
      diff: incomeDiff,
      icon: "💰",
      // For income, positive diff is good (earned more than planned)
      diffPositiveIsGood: true,
    },
    {
      label: "Fixní náklady",
      planned: totalFixedPlanned,
      actual: totalFixed,
      diff: totalFixed - totalFixedPlanned,
      icon: "🏠",
      diffPositiveIsGood: false,
    },
    {
      label: "Výdaje",
      planned: totalExpensesPlanned,
      actual: totalExpenses,
      diff: totalExpenses - totalExpensesPlanned,
      icon: "🛍️",
      diffPositiveIsGood: false,
    },
    {
      label: "Úspory",
      planned: totalSavingsPlanned,
      actual: totalSavings,
      diff: totalSavings - totalSavingsPlanned,
      icon: "🏦",
      diffPositiveIsGood: true,
    },
  ];

  const summaryRows = [
    {
      label: "Převod z min. měsíce",
      planned: data.carryOver,
      actual: data.carryOver,
    },
    {
      label: "Plánovaný příjem",
      planned: totalPlannedIncome,
      actual: totalActualIncome,
    },
    {
      label: "Uspořený příjem",
      planned: totalSavingsPlanned,
      actual: totalSavings,
    },
    {
      label: "Vynaložený příjem",
      planned: totalFixedPlanned + totalExpensesPlanned,
      actual: totalFixed + totalExpenses,
    },
    { label: "Splacený dluh", planned: 0, actual: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const diffColor =
            kpi.diff === 0
              ? "var(--color-text-faint)"
              : kpi.diff > 0 === kpi.diffPositiveIsGood
              ? "var(--color-success)"
              : "var(--color-danger)";

          return (
            <div
              key={i}
              className="rounded-2xl shadow-sm p-4 flex flex-col gap-1"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{kpi.icon}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {kpi.label}
                </span>
              </div>
              {/* Planned row */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  Plán
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {czk(kpi.planned)}
                </span>
              </div>
              {/* Actual row */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  Skutečné
                </span>
                <span
                  className="text-base font-black"
                  style={{ color: "var(--color-primary)" }}
                >
                  {czk(kpi.actual)}
                </span>
              </div>
              {/* Diff */}
              <div
                className="text-xs font-semibold text-right mt-0.5 pt-1"
                style={{
                  color: diffColor,
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {kpi.diff > 0 ? "+" : ""}
                {czk(kpi.diff)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            Plánováno vs Skutečné
          </h3>
          <BarChart
            rows={[
              {
                label: "Příjem",
                planned: totalPlannedIncome,
                actual: totalActualIncome,
              },
              {
                label: "Fixní",
                planned: totalFixedPlanned,
                actual: totalFixed,
              },
              {
                label: "Výdaje",
                planned: totalExpensesPlanned,
                actual: totalExpenses,
              },
              {
                label: "Úspory",
                planned: totalSavingsPlanned,
                actual: totalSavings,
              },
            ]}
          />
        </div>
        <DonutWithLegend title="Výdaje" items={data.expenses} />
        <DonutWithLegend title="Úspory" items={data.savings} />
      </div>

      {/* Budget summary table */}
      <div
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="px-4 py-3"
          style={{
            background: "var(--color-text-base)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h3
            className="font-bold tracking-wide uppercase text-xs"
            style={{ color: "var(--color-surface)" }}
          >
            Rozpočet a skutečnost
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-[10px] uppercase tracking-widest"
              style={{
                color: "var(--color-text-muted)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <th className="text-left pl-4 py-2">Položka</th>
              <th className="text-right px-4 py-2">Plánováno</th>
              <th className="text-right px-4 py-2">Skutečné</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--color-border)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--color-accent-subtle)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                <td
                  className="pl-4 py-2"
                  style={{ color: "var(--color-text-base)" }}
                >
                  {row.label}
                </td>
                <td
                  className="text-right px-4 py-2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {czk(row.planned)}
                </td>
                <td
                  className="text-right px-4 py-2 font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {czk(row.actual)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--color-primary-subtle)" }}>
              <td
                className="pl-4 py-3 font-black"
                style={{ color: "var(--color-primary)" }}
              >
                CELKEM
              </td>
              <td
                className="text-right px-4 py-3 font-bold"
                style={{ color: "var(--color-text-base)" }}
              >
                {czk(plannedBalance)}
              </td>
              <td
                className="text-right px-4 py-3 font-black text-lg"
                style={{ color: "var(--color-primary)" }}
              >
                {czk(balance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
