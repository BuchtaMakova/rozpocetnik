import { czk } from "../../utils";
import type { Person } from "../../types";

interface IncomeTabProps {
  persons: Person[];
  carryOver: number;
  totalPlannedIncome: number;
  totalActualIncome: number;
  incomeDiff: number;
  onAddPerson: () => void;
  onUpdatePerson: (index: number, patch: Partial<Person>) => void;
  onDeletePerson: (index: number) => void;
  onSetCarryOver: (value: number) => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  border: "1px solid var(--color-border-strong)",
  color: "var(--color-text-base)",
};

export function IncomeTab({
  persons,
  totalPlannedIncome,
  totalActualIncome,
  incomeDiff,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
}: IncomeTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {/* Persons table */}
      <div
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: "var(--color-text-base)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h3
            className="font-bold tracking-wide uppercase text-xs"
            style={{ color: "var(--color-surface)" }}
          >
            Příjmy
          </h3>
          <button
            onClick={onAddPerson}
            className="text-xs font-semibold px-3 py-1 rounded-full transition"
            style={{
              background: "var(--color-accent-light)",
              color: "var(--color-text-strong)",
            }}
          >
            + Přidat
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="text-[10px] uppercase tracking-widest"
                style={{
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <th className="text-left pl-4 py-2 w-48">Jméno</th>
                <th className="text-left px-3 py-2">Plánovaný příjem (Kč)</th>
                <th className="text-left px-3 py-2">Skutečný příjem (Kč)</th>
                <th className="text-left px-3 py-2">Rozdíl</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {persons.map((p, i) => {
                const diff = p.actualIncome - p.plannedIncome;
                return (
                  <tr
                    key={i}
                    className="group transition-colors"
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
                    {/* Name */}
                    <td className="py-2 pl-4 pr-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-accent-light), var(--color-primary))",
                          }}
                        >
                          {p.name[0]?.toUpperCase() || "?"}
                        </div>
                        <input
                          value={p.name}
                          onChange={(e) =>
                            onUpdatePerson(i, { name: e.target.value })
                          }
                          className="flex-1 min-w-0 rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none"
                          style={inputStyle}
                        />
                      </div>
                    </td>

                    {/* Planned income */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={p.plannedIncome || ""}
                        onChange={(e) =>
                          onUpdatePerson(i, {
                            plannedIncome: Number(e.target.value),
                          })
                        }
                        className="w-32 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none"
                        style={inputStyle}
                      />
                    </td>

                    {/* Actual income */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={p.actualIncome || ""}
                        onChange={(e) =>
                          onUpdatePerson(i, {
                            actualIncome: Number(e.target.value),
                          })
                        }
                        className="w-32 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none"
                        style={inputStyle}
                      />
                    </td>

                    {/* Diff */}
                    <td
                      className="py-2 px-3 text-sm font-semibold"
                      style={{
                        color:
                          diff > 0
                            ? "var(--color-success)"
                            : diff < 0
                            ? "var(--color-danger)"
                            : "var(--color-text-faint)",
                      }}
                    >
                      {diff > 0 ? "+" : ""}
                      {czk(diff)}
                    </td>

                    {/* Delete */}
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => onDeletePerson(i)}
                        className="opacity-0 group-hover:opacity-100 text-xl leading-none transition"
                        style={{ color: "var(--color-text-faint)" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "var(--color-danger)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "var(--color-text-faint)")
                        }
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals footer */}
            <tfoot>
              <tr
                className="font-bold text-sm"
                style={{
                  background: "var(--color-surface-raised)",
                  borderTop: "1px solid var(--color-border-strong)",
                }}
              >
                <td
                  className="pl-4 py-2.5"
                  style={{ color: "var(--color-primary)" }}
                >
                  CELKEM
                </td>
                <td
                  className="px-3 py-2.5"
                  style={{ color: "var(--color-text-base)" }}
                >
                  {czk(totalPlannedIncome)}
                </td>
                <td
                  className="px-3 py-2.5"
                  style={{ color: "var(--color-text-base)" }}
                >
                  {czk(totalActualIncome)}
                </td>
                <td
                  className="px-3 py-2.5"
                  style={{
                    color:
                      incomeDiff > 0
                        ? "var(--color-success)"
                        : incomeDiff < 0
                        ? "var(--color-danger)"
                        : "var(--color-text-faint)",
                  }}
                >
                  {incomeDiff > 0 ? "+" : ""}
                  {czk(incomeDiff)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
