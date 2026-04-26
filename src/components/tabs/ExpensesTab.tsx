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
    <div>
      <SectionTable
        title="Výdaje"
        items={expenses}
        onAdd={onAdd}
        onChangePlanned={onChangePlanned}
        onChangeActual={onChangeActual}
        onChangeName={onChangeName}
        onDelete={onDelete}
      />
    </div>
  );
}
