import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Header } from "./components/layout/Header";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { IncomeTab } from "./components/tabs/IncomeTab";
import { ExpensesTab } from "./components/tabs/ExpensesTab";
import { SavingsTab } from "./components/tabs/SavingsTab";
import { useBudget } from "./hooks/useBudget";
import "./styles/themes.css";
import "./App.css";

function BudgetApp() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Hook is now month/year aware — refetches on navigation
  const budget = useBudget(year, month);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-from), var(--color-bg-via), var(--color-bg-to))",
      }}
    >
      <Header
        month={month}
        year={year}
        data={budget.data}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Loading state */}
        {budget.isLoading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--color-primary)",
                borderTopColor: "transparent",
              }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              Načítám data…
            </span>
          </div>
        )}

        {/* Error state */}
        {budget.error && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
            }}
          >
            <div className="text-2xl mb-2">⚠️</div>
            <div className="font-semibold">Chyba při načítání dat</div>
            <div className="text-sm mt-1 opacity-75">{budget.error}</div>
          </div>
        )}

        {/* Content */}
        {!budget.isLoading && !budget.error && budget.data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExpensesTab
                expenses={budget.data.expenses}
                onAdd={budget.addExpense}
                onChangePlanned={budget.updateExpensePlanned}
                onChangeActual={budget.updateExpenseActual}
                onChangeName={budget.updateExpenseName}
                onDelete={budget.deleteExpense}
              />

              <SavingsTab
                savings={budget.data.savings}
                onAdd={budget.addSaving}
                onChangePlanned={budget.updateSavingPlanned}
                onChangeActual={budget.updateSavingActual}
                onChangeName={budget.updateSavingName}
                onDelete={budget.deleteSaving}
              />
            </div>
            <IncomeTab
              persons={budget.data.persons}
              carryOver={budget.data.carryOver}
              totalPlannedIncome={budget.totalPlannedIncome}
              totalActualIncome={budget.totalActualIncome}
              incomeDiff={budget.incomeDiff}
              onAddPerson={budget.addPerson}
              onUpdatePerson={budget.updatePerson}
              onDeletePerson={budget.deletePerson}
              onSetCarryOver={budget.setCarryOver}
            />
            <OverviewTab
              data={budget.data}
              totalPlannedIncome={budget.totalPlannedIncome}
              totalActualIncome={budget.totalActualIncome}
              incomeDiff={budget.incomeDiff}
              totalFixed={budget.totalFixed}
              totalFixedPlanned={budget.totalFixedPlanned}
              totalExpenses={budget.totalExpenses}
              totalExpensesPlanned={budget.totalExpensesPlanned}
              totalSavings={budget.totalSavings}
              totalSavingsPlanned={budget.totalSavingsPlanned}
              balance={budget.balance}
              plannedBalance={budget.plannedBalance}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BudgetApp />
    </ThemeProvider>
  );
}
