import type { MonthData } from "../types";

// ── Config ───────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const USE_API = !!API_BASE_URL;

const pad = (n: number) => String(n).padStart(2, "0");

const apiPath = (year: number, month: number) =>
  `${API_BASE_URL}/budget/${year}/${pad(month)}`;

const storageKey = (year: number, month: number) =>
  `budget_${year}_${pad(month)}`;

const emptyMonth = (year: number, month: number): MonthData => ({
  month,
  year,
  carryOver: 0,
  persons: [{ name: "Já", plannedIncome: 0, actualIncome: 0 }],
  fixedCosts: [],
  expenses: [],
  savings: [],
});

export async function fetchBudget(
  year: number,
  month: number,
): Promise<MonthData> {
  // Try API first if configured
  if (USE_API) {
    try {
      const url = apiPath(year, month);
      console.log(`[budgetApi] fetching from API → ${url}`);

      const res = await fetch(url);
      console.log(`[budgetApi] API response: ${res.status} ${res.statusText}`);

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          console.log(`[budgetApi] loaded from API`);
          return json.data;
        }
      }
    } catch (e) {
      console.warn(
        `[budgetApi] API fetch failed, falling back to localStorage`,
        e,
      );
    }
  }

  // Fall back to localStorage
  const key = storageKey(year, month);
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      const data = JSON.parse(stored);
      console.log(`[budgetApi] loaded from localStorage: ${key}`);
      return data;
    } catch (e) {
      console.error(`[budgetApi] Failed to parse localStorage data`, e);
    }
  }

  // Return empty month as last resort
  console.log(`[budgetApi] no data found, returning empty month`);
  return emptyMonth(year, month);
}

export async function saveBudget(data: MonthData): Promise<void> {
  // Save to localStorage first (always)
  const key = storageKey(data.year, data.month);
  localStorage.setItem(key, JSON.stringify(data));
  console.log(`[budgetApi] saved to localStorage: ${key}`);

  // Try to sync to API if configured
  if (USE_API) {
    try {
      const url = apiPath(data.year, data.month);
      console.log(`[budgetApi] syncing to API → ${url}`);

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log(`[budgetApi] synced to API successfully`);
      } else {
        console.warn(
          `[budgetApi] API sync failed: ${res.status} ${res.statusText}`,
        );
      }
    } catch (e) {
      console.warn(`[budgetApi] Failed to sync to API`, e);
    }
  }
}
