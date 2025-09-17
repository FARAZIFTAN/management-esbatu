import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ProfitAnalysisProps {
  sales: Array<{
    tanggal: string;
    tipe_ice: string;
    jumlah: number;
    harga: number;
    total: number;
  }>;
  expenses: Array<{
    kategori: string;
    jumlah: number;
    tanggal: string;
  }>;
}

const ProfitAnalysis = ({ sales, expenses }: ProfitAnalysisProps) => {
  const totalRevenue = sales.reduce((sum: number, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum: number, expense) => sum + expense.jumlah, 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Analisis Keuntungan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-700">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-700">
                Rp {totalExpenses.toLocaleString('id-ID')}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${profit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Keuntungan Bersih
              </p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                Rp {profit.toLocaleString('id-ID')}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${profit >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Margin Keuntungan</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Persentase Margin</span>
              <span className={`font-bold text-lg ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Rasio Keuangan</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">ROI (Return on Investment)</span>
              <span className="font-medium text-gray-800">
                {totalExpenses > 0 ? ((profit / totalExpenses) * 100).toFixed(1) : '0'}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Break Even Point</span>
              <span className="font-medium text-gray-800">
                {profit >= 0 ? 'Tercapai' : `Kurang Rp ${Math.abs(profit).toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalysis;
