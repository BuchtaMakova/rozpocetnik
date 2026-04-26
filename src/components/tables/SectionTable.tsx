import { czk } from "../../utils";
import type { LineItem } from "../../types";

interface SectionTableProps {
  title: string;
  items: LineItem[];
  onAdd: () => void;
  onChangePlanned: (id: string, value: number) => void;
  onChangeActual: (id: string, value: number) => void;
  onChangeName: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  invertedResults?: boolean;
}

export function SectionTable({
  title,
  items,
  onAdd,
  onChangePlanned,
  onChangeActual,
  onChangeName,
  onDelete,
  invertedResults,
}: SectionTableProps) {
  const totalPlanned = items.reduce((s, x) => s + x.planned, 0);
  const totalActual = items.reduce((s, x) => s + x.actual, 0);
  const totalDiff = totalActual - totalPlanned;

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background:
            "linear-gradient(to right, var(--color-surface-raised), var(--color-primary-subtle))",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h3
          className="font-bold tracking-wide uppercase text-xs"
          style={{ color: "var(--color-primary)" }}
        >
          {title}
        </h3>
        <button
          onClick={onAdd}
          className="text-xs font-semibold px-3 py-1 rounded-full transition"
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
        >
          + Přidat
        </button>
      </div>

      {/* Table */}
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
              <th className="text-left pl-3 py-2">Položka</th>
              <th className="text-left px-2 py-2">Plánováno (Kč)</th>
              <th className="text-left px-2 py-2">Skutečné (Kč)</th>
              <th className="text-left px-2 py-2">Rozdíl</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const diff = item.actual - item.planned;
              const getDiffColor = () => {
                if (invertedResults) {
                  return diff < 0
                    ? "var(--color-danger)"
                    : diff > 0
                    ? "var(--color-success)"
                    : "var(--color-text-faint)";
                } else {
                  return diff > 0
                    ? "var(--color-danger)"
                    : diff < 0
                    ? "var(--color-success)"
                    : "var(--color-text-faint)";
                }
              };
              const getDiffDisplay = () => {
                if (invertedResults) {
                  return diff < 0
                    ? `-${czk(Math.abs(diff))}`
                    : czk(Math.abs(diff));
                } else {
                  return diff > 0
                    ? `-${czk(Math.abs(diff))}`
                    : czk(Math.abs(diff));
                }
              };
              return (
                <tr
                  key={item.id}
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
                  <td
                    className="py-1.5 pl-3 pr-1 text-sm font-medium"
                    style={{ color: "var(--color-text-base)" }}
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onChangeName(item.id, e.target.value)}
                      className="w-full rounded-lg px-2 py-1 text-sm focus:outline-none"
                      style={{
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--color-text-base)",
                      }}
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      value={item.planned || ""}
                      onChange={(e) =>
                        onChangePlanned(item.id, Number(e.target.value))
                      }
                      className="w-28 rounded-lg px-2 py-1 text-sm focus:outline-none"
                      style={{
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--color-text-base)",
                      }}
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      value={item.actual || ""}
                      onChange={(e) =>
                        onChangeActual(item.id, Number(e.target.value))
                      }
                      className="w-28 rounded-lg px-2 py-1 text-sm focus:outline-none"
                      style={{
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--color-text-base)",
                      }}
                    />
                  </td>
                  <td
                    className="py-1.5 px-2 text-sm font-semibold"
                    style={{
                      color: getDiffColor(),
                    }}
                  >
                    {getDiffDisplay()}
                  </td>
                  <td className="py-1.5 pr-3">
                    <button
                      onClick={() => onDelete(item.id)}
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
          <tfoot>
            <tr
              className="font-bold text-sm"
              style={{
                background: "var(--color-surface-raised)",
                borderTop: "1px solid var(--color-border-strong)",
              }}
            >
              <td
                className="pl-3 py-2"
                style={{ color: "var(--color-primary)" }}
              >
                CELKEM
              </td>
              <td
                className="px-2 py-2"
                style={{ color: "var(--color-text-base)" }}
              >
                {czk(totalPlanned)}
              </td>
              <td
                className="px-2 py-2"
                style={{ color: "var(--color-text-base)" }}
              >
                {czk(totalActual)}
              </td>
              <td
                className="px-2 py-2"
                style={{
                  color: invertedResults
                    ? totalDiff < 0
                      ? "var(--color-danger)"
                      : totalDiff > 0
                      ? "var(--color-success)"
                      : "var(--color-text-faint)"
                    : totalDiff > 0
                    ? "var(--color-danger)"
                    : totalDiff < 0
                    ? "var(--color-success)"
                    : "var(--color-text-faint)",
                }}
              >
                {invertedResults
                  ? totalDiff < 0
                    ? `-${czk(Math.abs(totalDiff))}`
                    : czk(Math.abs(totalDiff))
                  : totalDiff > 0
                  ? `-${czk(Math.abs(totalDiff))}`
                  : czk(Math.abs(totalDiff))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
