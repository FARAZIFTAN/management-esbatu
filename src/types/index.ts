export interface Sale {
  id: string;
  quantity: number;
  totalPrice: number;
  date: string;
  time: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  profit: number;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  description: string;
  amount: number;
  date: string;
  time: string;
}