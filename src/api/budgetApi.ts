import type { MonthData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const USE_API = !!API_BASE_URL;

const pad = (n: number) => String(n).padStart(2, "0");
const apiPath = (year: number, month: number) =>
  `${API_BASE_URL}/budget/${year}/${pad(month)}`;
const storageKey = (year: number, month: number) =>
  `budget_${year}_${pad(month)}`;

// Helper to calculate the actual closing balance of any month data
export const calculateClosingBalance = (data: MonthData): number => {
  const totalIncome = data.persons.reduce((s, p) => s + p.actualIncome, 0);
  const totalOut =
    data.fixedCosts.reduce((s, x) => s + x.actual, 0) +
    data.expenses.reduce((s, x) => s + x.actual, 0);
  return totalIncome + (data.carryOver || 0) - totalOut;
};

const emptyMonth = (year: number, month: number, carryOver = 0): MonthData => ({
  month,
  year,
  carryOver,
  persons: [{ name: "Já", plannedIncome: 0, actualIncome: 0 }],
  fixedCosts: [],
  expenses: [],
});

export async function fetchBudget(
  year: number,
  month: number,
): Promise<MonthData> {
  if (USE_API) {
    try {
      const res = await fetch(apiPath(year, month));
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn(`[budgetApi] API fail, fallback to local`, e);
    }
  }

  const key = storageKey(year, month);
  const stored = localStorage.getItem(key);

  if (stored) {
    return JSON.parse(stored);
  }

  // AUTO-CARRYOVER LOGIC: Look for previous month to seed new month
  const prevDate = new Date(year, month - 1);
  const prevKey = storageKey(prevDate.getFullYear(), prevDate.getMonth());
  const prevStored = localStorage.getItem(prevKey);

  let initialCarry = 0;
  if (prevStored) {
    try {
      initialCarry = calculateClosingBalance(JSON.parse(prevStored));
    } catch (e) {
      console.error("Failed to calculate carryover", e);
    }
  }

  return emptyMonth(year, month, initialCarry);
}

export async function saveBudget(data: MonthData): Promise<void> {
  const key = storageKey(data.year, data.month);
  localStorage.setItem(key, JSON.stringify(data));

  if (USE_API) {
    try {
      await fetch(apiPath(data.year, data.month), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn(`[budgetApi] API sync failed`, e);
    }
  }
}
