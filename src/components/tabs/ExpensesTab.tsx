import { SectionTable } from "../tables/SectionTable";
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
