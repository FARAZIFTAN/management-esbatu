import { useState, useMemo, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { FullPageLoading } from './components/LoadingSpinner';
import { Sale, Expense, DashboardStats } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load components
  const Dashboard = lazy(() => import('./components/Dashboard'));
  const Sales = lazy(() => import('./components/Sales'));
  const Expenses = lazy(() => import('./components/Expenses'));
  const Cash = lazy(() => import('./components/Cash'));
  const Reports = lazy(() => import('./components/Reports'));

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sales, setSales] = useLocalStorage<Sale[]>('ice-sales', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('ice-expenses', []);

  // Calculate dashboard stats
  const stats: DashboardStats = useMemo(() => {
    const totalIncome = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
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
        .filter(sale => sale.date && sale.date === date)
        .reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
      
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
        return <Dashboard {...({ stats, dailySales } as any)} />;
      case 'sales':
        return (
          <Sales 
            {...({ 
              sales,
              onAddSale: handleAddSale,
              onDeleteSale: handleDeleteSale 
            } as any)}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            {...({ 
              expenses,
              onAddExpense: handleAddExpense,
              onDeleteExpense: handleDeleteExpense 
            } as any)}
          />
        );
      case 'reports':
        return <Reports {...({ sales, expenses } as any)} />;
      case 'cash':
        return <Cash {...({ sales, expenses } as any)} />;
      default:
        return <Dashboard {...({ stats, dailySales } as any)} />;
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          <Suspense fallback={<FullPageLoading text="Memuat halaman..." />}>
            {renderPage()}
          </Suspense>
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;