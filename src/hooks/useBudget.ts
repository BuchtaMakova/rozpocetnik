import { useState, useEffect, useCallback } from "react";
import type { MonthData, LineItem, Person } from "../types";
import { uid } from "../utils";
import {
  fetchBudget,
  saveBudget,
  calculateClosingBalance,
} from "../api/budgetApi";

type Status = "idle" | "loading" | "error";

export function useBudget(year: number, month: number) {
  const [data, setData] = useState<MonthData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchBudget(year, month)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setStatus("idle");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(String(e));
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const update = useCallback((fn: (d: MonthData) => MonthData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = fn({ ...prev });

      // 1. Save current month
      saveBudget(next).catch(console.error);

      // 2. CHAIN REACTION: Update next month's carryover if it exists
      const currentClosingBalance = calculateClosingBalance(next);
      const nextDate = new Date(next.year, next.month + 1);
      const nextKey = `budget_${nextDate.getFullYear()}_${String(
        nextDate.getMonth(),
      ).padStart(2, "0")}`;

      const nextStored = localStorage.getItem(nextKey);
      if (nextStored) {
        try {
          const nextData: MonthData = JSON.parse(nextStored);
          if (nextData.carryOver !== currentClosingBalance) {
            nextData.carryOver = currentClosingBalance;
            localStorage.setItem(nextKey, JSON.stringify(nextData));
            // Note: If you are currently viewing the next month,
            // you'd need a cross-tab state manager to see it live,
            // but this ensures the data is correct upon next load.
          }
        } catch (e) {
          console.error("Chain update failed", e);
        }
      }

      return next;
    });
  }, []);

  // --- Actions ---
  const addPerson = () =>
    update((d) => ({
      ...d,
      persons: [
        ...d.persons,
        { name: "Nová osoba", plannedIncome: 0, actualIncome: 0 },
      ],
    }));
  const updatePerson = (index: number, patch: Partial<Person>) =>
    update((d) => {
      d.persons[index] = { ...d.persons[index], ...patch };
      return d;
    });
  const deletePerson = (index: number) =>
    update((d) => ({ ...d, persons: d.persons.filter((_, i) => i !== index) }));
  const setCarryOver = (v: number) => update((d) => ({ ...d, carryOver: v }));

  const makeAdder =
    (key: "fixedCosts" | "expenses" | "savings", def: string) => () =>
      update((d) => ({
        ...d,
        [key]: [...d[key], { id: uid(), name: def, planned: 0, actual: 0 }],
      }));
  const makeUpdater =
    (key: "fixedCosts" | "expenses" | "savings", field: "planned" | "actual") =>
    (id: string, val: number) =>
      update((d) => {
        const item = (d[key] as LineItem[]).find((x) => x.id === id);
        if (item) item[field] = val;
        return d;
      });
  const makeDeleter =
    (key: "fixedCosts" | "expenses" | "savings") => (id: string) =>
      update((d) => ({
        ...d,
        [key]: (d[key] as LineItem[]).filter((x) => x.id !== id),
      }));
  const makeNameUpdater =
    (key: "fixedCosts" | "expenses" | "savings") =>
    (id: string, name: string) =>
      update((d) => {
        const item = (d[key] as LineItem[]).find((x) => x.id === id);
        if (item) item.name = name;
        return d;
      });

  // --- Derived Totals ---
  const totalPlannedIncome =
    data?.persons.reduce((s, p) => s + p.plannedIncome, 0) ?? 0;
  const totalActualIncome =
    data?.persons.reduce((s, p) => s + p.actualIncome, 0) ?? 0;
  const totalFixed = data?.fixedCosts.reduce((s, x) => s + x.actual, 0) ?? 0;
  const totalFixedPlanned =
    data?.fixedCosts.reduce((s, x) => s + x.planned, 0) ?? 0;
  const totalExpenses = data?.expenses.reduce((s, x) => s + x.actual, 0) ?? 0;
  const totalExpensesPlanned =
    data?.expenses.reduce((s, x) => s + x.planned, 0) ?? 0;
  const totalSavings = data?.savings.reduce((s, x) => s + x.actual, 0) ?? 0;
  const totalSavingsPlanned =
    data?.savings.reduce((s, x) => s + x.planned, 0) ?? 0;

  const balance = calculateClosingBalance(
    data || {
      persons: [],
      fixedCosts: [],
      expenses: [],
      savings: [],
      carryOver: 0,
      month: 0,
      year: 0,
    },
  );
  const plannedBalance =
    totalPlannedIncome +
    (data?.carryOver ?? 0) -
    (totalFixedPlanned + totalExpensesPlanned + totalSavingsPlanned);

  return {
    data,
    status,
    error,
    isLoading: status === "loading",
    addPerson,
    updatePerson,
    deletePerson,
    setCarryOver,
    addFixedCost: makeAdder("fixedCosts", "Nová položka"),
    updateFixedPlanned: makeUpdater("fixedCosts", "planned"),
    updateFixedActual: makeUpdater("fixedCosts", "actual"),
    updateFixedName: makeNameUpdater("fixedCosts"),
    deleteFixedCost: makeDeleter("fixedCosts"),
    addExpense: makeAdder("expenses", "Nová položka"),
    updateExpensePlanned: makeUpdater("expenses", "planned"),
    updateExpenseActual: makeUpdater("expenses", "actual"),
    updateExpenseName: makeNameUpdater("expenses"),
    deleteExpense: makeDeleter("expenses"),
    addSaving: makeAdder("savings", "Nový cíl"),
    updateSavingPlanned: makeUpdater("savings", "planned"),
    updateSavingActual: makeUpdater("savings", "actual"),
    updateSavingName: makeNameUpdater("savings"),
    deleteSaving: makeDeleter("savings"),
    totalPlannedIncome,
    totalActualIncome,
    incomeDiff: totalActualIncome - totalPlannedIncome,
    totalFixed,
    totalFixedPlanned,
    totalExpenses,
    totalExpensesPlanned,
    totalSavings,
    totalSavingsPlanned,
    balance,
    plannedBalance,
  };
}
