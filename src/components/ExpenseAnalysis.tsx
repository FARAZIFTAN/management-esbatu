import { TrendingUp, TrendingDown } from 'lucide-react';

interface ExpenseAnalysisProps {
  expenses: Array<{
    kategori: string;
    jumlah: number;
    tanggal: string;
  }>;
}

const ExpenseAnalysis = ({ expenses }: ExpenseAnalysisProps) => {
  const totalExpenses = expenses.reduce((sum: number, expense) => sum + expense.jumlah, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Analisis Pengeluaran</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-700">
                Rp {totalExpenses.toLocaleString('id-ID')}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Rata-rata Harian</p>
              <p className="text-2xl font-bold text-blue-700">
                Rp {Math.round(totalExpenses / Math.max(expenses.length, 1)).toLocaleString('id-ID')}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">Kategori Pengeluaran Terbesar</h4>
        <div className="space-y-2">
          {expenses.slice(0, 5).map((expense, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{expense.kategori}</span>
              <span className="font-medium text-gray-800">
                Rp {expense.jumlah.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
