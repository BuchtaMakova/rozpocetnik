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
  balance: number;
  plannedBalance: number;
}

export function OverviewTab({
  data,
  totalPlannedIncome,
  totalActualIncome,
  totalFixed,
  totalFixedPlanned,
  totalExpenses,
  totalExpensesPlanned,
  balance,
  plannedBalance,
}: OverviewTabProps) {
  const summaryRows = [
    {
      label: "Převod z min. měsíce",
      planned: data.carryOver,
      actual: data.carryOver,
    },
    {
      label: "Příjem",
      planned: totalPlannedIncome,
      actual: totalActualIncome,
    },

    {
      label: "Výdaje",
      planned: -totalExpensesPlanned,
      actual: -totalExpenses,
    },
    {
      label: "Fixní náklady",
      planned: -totalFixedPlanned,
      actual: -totalFixed,
    },
  ];

  return (
    <div className="space-y-6">
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
            ]}
          />
        </div>
        <DonutWithLegend title="Výdaje" items={data.expenses} />
        <DonutWithLegend title="Fixní náklady" items={data.fixedCosts} />
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
