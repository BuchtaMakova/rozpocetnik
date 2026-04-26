import { SectionTable } from "../tables/SectionTable";

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
  return (
    <div>
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
    </div>
  );
}
