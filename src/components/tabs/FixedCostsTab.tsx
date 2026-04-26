import { SectionTable } from "../tables/SectionTable";

import type { LineItem } from "../../types";

interface FixedCostsProps {
  fixedCosts: LineItem[];
  onAdd: () => void;
  onChangePlanned: (id: string, value: number) => void;
  onChangeActual: (id: string, value: number) => void;
  onChangeName: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

export function FixedCostsTab({
  fixedCosts,
  onAdd,
  onChangePlanned,
  onChangeActual,
  onChangeName,
  onDelete,
}: FixedCostsProps) {
  return (
    <div>
      <SectionTable
        title="Fixní náklady"
        items={fixedCosts}
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
