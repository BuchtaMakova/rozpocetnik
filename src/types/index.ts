// ── Domain models ────────────────────────────────────────

export interface Person {
  name: string;
  plannedIncome: number;
  actualIncome: number;
}

export interface LineItem {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

export interface FixedCost extends LineItem {
  dueDay?: number;
}

export interface MonthData {
  month: number;       // 0-based (0 = January)
  year: number;
  persons: Person[];
  fixedCosts: FixedCost[];
  expenses: LineItem[];
  savings: LineItem[];
  carryOver: number;
}

export type TabId = "overview" | "income" | "fixed" | "expenses" | "savings";

// ── API envelope ─────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export type BudgetApiResponse = ApiResponse<MonthData>;
