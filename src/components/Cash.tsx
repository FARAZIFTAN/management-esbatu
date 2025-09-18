import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Sale, Expense, Transaction } from '../types';
import { formatCurrency } from '../utils/pricing';

interface CashProps {
  sales: Sale[];
  expenses: Expense[];
}

const Cash: React.FC<CashProps> = ({ sales, expenses }) => {
  const totalIncome = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const currentBalance = totalIncome - totalExpenses;

  // Create combined transaction history
  const transactions: Transaction[] = [
    ...sales.map(sale => ({
      id: `sale-${sale.id}`,
      type: 'sale' as const,
      description: `Penjualan ${sale.quantity || 0} es batu`,
      amount: sale.totalPrice || 0,
      date: sale.date || '',
      time: sale.time || '',
    })),
    ...expenses.map(expense => ({
      id: `expense-${expense.id}`,
      type: 'expense' as const,
      description: expense.name || 'Pengeluaran',
      amount: -(expense.amount || 0),
      date: expense.date || '',
      time: '00:00',
    })),
  ].sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kas / Saldo</h1>
        <p className="text-gray-600">Monitor saldo dan riwayat transaksi</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium opacity-90 mb-2">Saldo Saat Ini</h2>
            <p className="text-4xl font-bold mb-2">{formatCurrency(currentBalance)}</p>
            <p className="text-sm opacity-80">
              {currentBalance >= 0 ? 'Keuangan dalam kondisi sehat' : 'Perlu perhatian pada pengeluaran'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <Wallet className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-emerald-700 mb-1">Total Pemasukan</h3>
              <p className="text-2xl font-bold text-emerald-800">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                {sales.length} transaksi penjualan
              </p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-700 mb-1">Total Pengeluaran</h3>
              <p className="text-2xl font-bold text-red-800">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {expenses.length} transaksi pengeluaran
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Riwayat Transaksi</h2>
          <p className="text-sm text-gray-600 mt-1">
            Semua transaksi yang mempengaruhi saldo kas
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'sale' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'sale' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('id-ID')} 
                        {transaction.time !== '00:00' && ` • ${transaction.time}`}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada transaksi</p>
              <p className="text-sm mt-1">Transaksi akan muncul di sini setelah ada penjualan atau pengeluaran</p>
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Indicator */}
      <div className={`p-6 rounded-xl border ${
        currentBalance >= 0 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          currentBalance >= 0 ? 'text-green-800' : 'text-yellow-800'
        }`}>
          Status Keuangan
        </h3>
        <p className={`text-sm ${
          currentBalance >= 0 ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {currentBalance >= 0 
            ? 'Usaha Anda dalam kondisi keuangan yang sehat. Pertahankan penjualan dan kontrol pengeluaran.'
            : 'Saldo negatif. Pertimbangkan untuk meningkatkan penjualan atau mengurangi pengeluaran.'
          }
        </p>
      </div>
    </div>
  );
};

export default Cash;