import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Cash from './components/Cash';
import { Sale, Expense, DashboardStats } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sales, setSales] = useLocalStorage<Sale[]>('ice-sales', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('ice-expenses', []);

  // Calculate dashboard stats
  const stats: DashboardStats = useMemo(() => {
    const totalIncome = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    const profit = balance; // In this simple case, profit equals balance
    
    return { totalIncome, totalExpenses, balance, profit };
  }, [sales, expenses]);

  // Calculate daily sales for chart (last 7 days)
  const dailySales = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTotal = sales
        .filter(sale => sale.date === date)
        .reduce((sum, sale) => sum + sale.totalPrice, 0);
      
      return { date, amount: dayTotal };
    });
  }, [sales]);

  // Sale handlers
  const handleAddSale = (saleData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setSales(prev => [newSale, ...prev]);
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} dailySales={dailySales} />;
      case 'sales':
        return (
          <Sales 
            sales={sales} 
            onAddSale={handleAddSale} 
            onDeleteSale={handleDeleteSale} 
          />
        );
      case 'expenses':
        return (
          <Expenses 
            expenses={expenses} 
            onAddExpense={handleAddExpense} 
            onDeleteExpense={handleDeleteExpense} 
          />
        );
      case 'reports':
        return <Reports sales={sales} expenses={expenses} />;
      case 'cash':
        return <Cash sales={sales} expenses={expenses} />;
      default:
        return <Dashboard stats={stats} dailySales={dailySales} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;