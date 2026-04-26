import type { MonthData } from "../types";

export async function exportToExcel(data: MonthData) {
  // Dynamic import to keep xlsx optional
  const XLSX = await import("xlsx");

  const pad = (n: number) => String(n).padStart(2, "0");
  const monthName = new Date(data.year, data.month, 1).toLocaleDateString(
    "cs-CZ",
    {
      month: "long",
      year: "numeric",
    },
  );

  const workbook = XLSX.utils.book_new();

  // ── Overview Sheet ──────────────────────────
  const overviewData = [
    ["Přehled rozpočtu " + monthName],
    ["", "Plánováno (Kč)", "Skutečné (Kč)", "Rozdíl"],
    ["Příjem"],
    ["Osoba"],
    ...data.persons.map((p) => [
      p.name,
      p.plannedIncome,
      p.actualIncome,
      p.actualIncome - p.plannedIncome,
    ]),
    [
      "CELKEM PŘÍJEM",
      data.persons.reduce((s, p) => s + p.plannedIncome, 0),
      data.persons.reduce((s, p) => s + p.actualIncome, 0),
    ],
    [],
    ["Fixní náklady"],
    ...data.fixedCosts.map((i) => [
      i.name,
      i.planned,
      i.actual,
      i.actual - i.planned,
    ]),
    [
      "CELKEM FIXNÍ",
      data.fixedCosts.reduce((s, i) => s + i.planned, 0),
      data.fixedCosts.reduce((s, i) => s + i.actual, 0),
    ],
    [],
    ["Výdaje"],
    ...data.expenses.map((i) => [
      i.name,
      i.planned,
      i.actual,
      i.actual - i.planned,
    ]),
    [
      "CELKEM VÝDAJE",
      data.expenses.reduce((s, i) => s + i.planned, 0),
      data.expenses.reduce((s, i) => s + i.actual, 0),
    ],
    [],

    [],
    ["Přesun z minula", data.carryOver],
  ];

  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  overviewSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Přehled");

  // ── Income Sheet ────────────────────────────
  const incomeData = [
    ["Příjem " + monthName],
    ["Osoba", "Plánováno (Kč)", "Skutečné (Kč)", "Rozdíl"],
    ...data.persons.map((p) => [
      p.name,
      p.plannedIncome,
      p.actualIncome,
      p.actualIncome - p.plannedIncome,
    ]),
  ];

  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  incomeSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, incomeSheet, "Příjem");

  // ── Fixed Costs Sheet ───────────────────────
  const fixedData = [
    ["Fixní náklady " + monthName],
    ["Položka", "Plánováno (Kč)", "Skutečné (Kč)", "Rozdíl"],
    ...data.fixedCosts.map((i) => [
      i.name,
      i.planned,
      i.actual,
      i.actual - i.planned,
    ]),
  ];

  const fixedSheet = XLSX.utils.aoa_to_sheet(fixedData);
  fixedSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, fixedSheet, "Fixní náklady");

  // ── Expenses Sheet ──────────────────────────
  const expensesData = [
    ["Výdaje " + monthName],
    ["Položka", "Plánováno (Kč)", "Skutečné (Kč)", "Rozdíl"],
    ...data.expenses.map((i) => [
      i.name,
      i.planned,
      i.actual,
      i.actual - i.planned,
    ]),
  ];

  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  expensesSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, expensesSheet, "Výdaje");

  // ── Write file ──────────────────────────────
  const fileName = `rozpocet_${data.year}-${pad(data.month)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
