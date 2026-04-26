import { useState, useEffect, useCallback } from "react";
import type { MonthData, LineItem, Person } from "../types";
import { uid } from "../utils";
import { fetchBudget, saveBudget } from "../api/budgetApi";

type Status = "idle" | "loading" | "error";

export function useBudget(year: number, month: number) {
  const [data, setData] = useState<MonthData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // ── Fetch whenever month/year changes ────────────────
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

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

  // ── Helpers ──────────────────────────────────────────
  const update = useCallback((fn: (d: MonthData) => MonthData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = fn({ ...prev });
      // Fire-and-forget save; errors logged to console
      saveBudget(next).catch(console.error);
      return next;
    });
  }, []);

  // ── Persons ──────────────────────────────────────────
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

  // ── Generic line-item helpers ─────────────────────────
  const makeAdder =
    (key: "fixedCosts" | "expenses" | "savings", defaultName: string) => () =>
      update((d) => ({
        ...d,
        [key]: [
          ...d[key],
          { id: uid(), name: defaultName, planned: 0, actual: 0 },
        ],
      }));

  const makeUpdater =
    (key: "fixedCosts" | "expenses" | "savings", field: "planned" | "actual") =>
    (id: string, value: number) =>
      update((d) => {
        const item = (d[key] as LineItem[]).find((x) => x.id === id);
        if (item) item[field] = value;
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

  // ── Derived totals ────────────────────────────────────
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
  const totalSpent = totalFixed + totalExpenses + totalSavings;
  const totalSpentPlanned =
    totalFixedPlanned + totalExpensesPlanned + totalSavingsPlanned;
  const balance = totalActualIncome + (data?.carryOver ?? 0) - totalSpent;
  const plannedBalance =
    totalPlannedIncome + (data?.carryOver ?? 0) - totalSpentPlanned;
  const incomeDiff = totalActualIncome - totalPlannedIncome;

  return {
    // state
    data,
    status,
    error,
    isLoading: status === "loading",

    // persons
    addPerson,
    updatePerson,
    deletePerson,
    setCarryOver,

    // fixed costs
    addFixedCost: makeAdder("fixedCosts", "Nová položka"),
    updateFixedPlanned: makeUpdater("fixedCosts", "planned"),
    updateFixedActual: makeUpdater("fixedCosts", "actual"),
    updateFixedName: makeNameUpdater("fixedCosts"),
    deleteFixedCost: makeDeleter("fixedCosts"),

    // expenses
    addExpense: makeAdder("expenses", "Nová položka"),
    updateExpensePlanned: makeUpdater("expenses", "planned"),
    updateExpenseActual: makeUpdater("expenses", "actual"),
    updateExpenseName: makeNameUpdater("expenses"),
    deleteExpense: makeDeleter("expenses"),

    // savings
    addSaving: makeAdder("savings", "Nový cíl"),
    updateSavingPlanned: makeUpdater("savings", "planned"),
    updateSavingActual: makeUpdater("savings", "actual"),
    updateSavingName: makeNameUpdater("savings"),
    deleteSaving: makeDeleter("savings"),

    // totals
    totalPlannedIncome,
    totalActualIncome,
    incomeDiff,
    totalFixed,
    totalFixedPlanned,
    totalExpenses,
    totalExpensesPlanned,
    totalSavings,
    totalSavingsPlanned,
    totalSpent,
    totalSpentPlanned,
    balance,
    plannedBalance,
  };
}
