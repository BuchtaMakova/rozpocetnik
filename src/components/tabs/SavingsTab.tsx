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
