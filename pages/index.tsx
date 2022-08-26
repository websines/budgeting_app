import type { NextPage } from "next";
import { SyntheticEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import BudgetCard from "../components/BudgetCard";
import UncategorizedBudgetCard from "../components/UncategorizedBudgetCard";
import TotalBudgetCard from "../components/TotalBudgetCard";
import AddBudget from "../components/AddBudget";
import AddExpense from "../components/AddExpense";
import useLocalStorage from "../lib/useLocalStorage";
import BudgetStateInterface from "../types/BudgetStateInterface";
import Expense from "../types/Expense";
import Background from "../components/Background";
import { ThemeProvider } from "../themes/mode";

const Home: NextPage = () => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("Uncategorized");
  const [uncategorizedExpenses, setUncategorizedExpenses] = useState<Expense[]>(
    []
  );

  const [budgets, setBudgets] = useState<BudgetStateInterface[]>([]);
  const [storedValue, setValue] = useLocalStorage<BudgetStateInterface[]>(
    "_Budgets",
    []
  );
  const [storedUncategorized, setStoredUncategorized] = useLocalStorage<
    Expense[]
  >("_UncategorizedExpenses", []);

  useEffect(() => setBudgets(storedValue), []);
  useEffect(() => setValue(budgets), [budgets]);

  useEffect(() => setUncategorizedExpenses(storedUncategorized), []);
  useEffect(
    () => setStoredUncategorized(uncategorizedExpenses),
    [uncategorizedExpenses]
  );

  function handleShowAddBudget() {
    setShowAddBudget(!showAddBudget);
  }

  function handleShowAddExpense(
    _event: SyntheticEvent,
    budgetName?: string
  ): void {
    setShowAddExpense(!showAddExpense);
    budgetName && setSelectedBudget(budgetName);
  }

  function handleStateChange(newState: []) {
    setBudgets(newState);
  }

  function handleBudgetDelete(categoryBudget: BudgetStateInterface) {
    const { category, individualExpenses } = categoryBudget;

    const expenses = individualExpenses.map((expense) => expense);
    setUncategorizedExpenses([...uncategorizedExpenses, ...expenses]);

    const updatedBudgets = budgets.filter(
      (budget) => budget.category !== category
    );
    setBudgets(updatedBudgets);
  }

  function handleUncategorizedDelete(uncategorizedId: number) {
    const updatedUncategorized = uncategorizedExpenses.filter(
      (expense) => expense.id !== uncategorizedId
    );
    setUncategorizedExpenses(updatedUncategorized);
  }

  return (
    <ThemeProvider>
      <Background>
        <div className="container mx-auto dark:text-white selection:text-violet-500 dark:selection:text-teal-200">
          <Header
            onShowAddBudget={handleShowAddBudget}
            onShowAddExpense={handleShowAddExpense}
          />
          {budgets.map((budget, index) => (
            <BudgetCard
              key={index}
              onShowAddExpense={handleShowAddExpense}
              categoryBudget={budget}
              budgets={budgets}
              handleBudgetsChange={handleStateChange}
              onHandleBudgetDelete={handleBudgetDelete}
            />
          ))}
          <UncategorizedBudgetCard
            onShowAddExpense={handleShowAddExpense}
            uncategorized={uncategorizedExpenses}
            onHandleUncategorizedDelete={handleUncategorizedDelete}
          />
          <TotalBudgetCard
            budgets={budgets}
            onShowAddExpense={handleShowAddExpense}
          />
          {showAddBudget && (
            <AddBudget
              state={budgets}
              onHandleStateChange={handleStateChange}
              onCloseAddBudget={handleShowAddBudget}
            />
          )}
          {showAddExpense && (
            <AddExpense
              state={budgets}
              onCloseAddExpense={handleShowAddExpense}
              onHandleStateChange={handleStateChange}
              selectedBudget={selectedBudget}
            />
          )}
        </div>
      </Background>
    </ThemeProvider>
  );
};

export default Home;
