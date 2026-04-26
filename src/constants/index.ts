import type { MonthData } from "../types";

export const MONTHS_CZ = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
];

export const DONUT_COLORS_SAVINGS = [
  "#f9a8d4", "#fb7185", "#fda4af", "#f472b6",
  "#e879f9", "#c084fc", "#a78bfa",
];

export const DONUT_COLORS_EXPENSES = [
  "#fca5a5", "#fb923c", "#fbbf24", "#a3e635",
  "#34d399", "#38bdf8", "#818cf8",
];

export const defaultData = (): MonthData => ({
  persons: [
    { name: "Já", income: 35000 },
    { name: "Partner/ka", income: 28000 },
  ],
  fixedCosts: [
    { id: "1", name: "Nájem", planned: 12000, actual: 12000, dueDay: 1 },
    { id: "2", name: "Elektřina", planned: 800, actual: 800 },
    { id: "3", name: "Plyn", planned: 1500, actual: 1500, dueDay: 15 },
    { id: "4", name: "Internet", planned: 500, actual: 500 },
    { id: "5", name: "Pojištění", planned: 2000, actual: 2000 },
    { id: "6", name: "Netflix", planned: 350, actual: 350 },
    { id: "7", name: "Oneplay", planned: 250, actual: 0 },
  ],
  expenses: [
    { id: "1", name: "Doprava", planned: 1500, actual: 2400 },
    { id: "2", name: "Výlety", planned: 1500, actual: 3400 },
    { id: "3", name: "Záloha", planned: 1000, actual: 3000 },
    { id: "4", name: "Hospoda", planned: 1000, actual: 2400 },
    { id: "5", name: "Nové boty", planned: 800, actual: 1000 },
  ],
  savings: [
    { id: "1", name: "Barák", planned: 5000, actual: 5000 },
    { id: "2", name: "Audi A5 3.0TFSi", planned: 3000, actual: 3000 },
    { id: "3", name: "Nová televize", planned: 1000, actual: 1000 },
    { id: "4", name: "iPhone 16 Pro", planned: 0, actual: 500 },
  ],
  carryOver: 0,
});
