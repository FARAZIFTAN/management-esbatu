import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Sale, Expense } from '../types';
import { formatCurrency } from '../utils/pricing';

interface ReportsProps {
  sales: Sale[];
  expenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ sales, expenses }) => {
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const filteredData = useMemo(() => {
    let filteredSales: Sale[] = [];
    let filteredExpenses: Expense[] = [];

    switch (filterType) {
      case 'day':
        filteredSales = sales.filter(sale => sale.date === selectedDate);
        filteredExpenses = expenses.filter(expense => expense.date === selectedDate);
        break;
      case 'month':
        filteredSales = sales.filter(sale => sale.date.startsWith(selectedMonth));
        filteredExpenses = expenses.filter(expense => expense.date.startsWith(selectedMonth));
        break;
      case 'year':
        filteredSales = sales.filter(sale => sale.date.startsWith(selectedYear));
        filteredExpenses = expenses.filter(expense => expense.date.startsWith(selectedYear));
        break;
    }

    const totalIncome = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = totalIncome - totalExpenses;

    return { filteredSales, filteredExpenses, totalIncome, totalExpenses, profit };
  }, [sales, expenses, filterType, selectedDate, selectedMonth, selectedYear]);

  const handleExport = (format: 'excel' | 'pdf') => {
    // Simulated export functionality
    const data = {
      period: filterType === 'day' ? selectedDate : filterType === 'month' ? selectedMonth : selectedYear,
      type: filterType,
      summary: {
        totalIncome: filteredData.totalIncome,
        totalExpenses: filteredData.totalExpenses,
        profit: filteredData.profit,
      },
      sales: filteredData.filteredSales,
      expenses: filteredData.filteredExpenses,
    };

    // In a real app, this would trigger actual file download
    console.log(`Exporting ${format} report:`, data);
    alert(`Laporan ${format.toUpperCase()} berhasil di-download! (Simulasi)`);
  };

  const getPeriodLabel = () => {
    switch (filterType) {
      case 'day':
        return new Date(selectedDate).toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case 'month':
        return new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'year':
        return selectedYear;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
        <p className="text-gray-600">Analisis keuangan usaha es batu</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Filter Laporan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Filter
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'day' | 'month' | 'year')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="day">Harian</option>
              <option value="month">Bulanan</option>
              <option value="year">Tahunan</option>
            </select>
          </div>

          {filterType === 'day' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}

          {filterType === 'month' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Bulan
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}

          {filterType === 'year' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tahun
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                min="2020"
                max="2030"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}

          <div className="flex items-end space-x-2">
            <button
              onClick={() => handleExport('excel')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs">Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
          <h3 className="text-sm font-medium text-emerald-700 mb-2">Pemasukan</h3>
          <p className="text-2xl font-bold text-emerald-800">
            {formatCurrency(filteredData.totalIncome)}
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            {filteredData.filteredSales.length} transaksi
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h3 className="text-sm font-medium text-red-700 mb-2">Pengeluaran</h3>
          <p className="text-2xl font-bold text-red-800">
            {formatCurrency(filteredData.totalExpenses)}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {filteredData.filteredExpenses.length} transaksi
          </p>
        </div>

        <div className={`p-6 rounded-xl border ${filteredData.profit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-sm font-medium mb-2 ${filteredData.profit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            Laba/Rugi
          </h3>
          <p className={`text-2xl font-bold ${filteredData.profit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
            {formatCurrency(filteredData.profit)}
          </p>
          <p className={`text-sm mt-1 ${filteredData.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            Periode: {getPeriodLabel()}
          </p>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Laporan Detail</h2>
            <p className="text-sm text-gray-600">Periode: {getPeriodLabel()}</p>
          </div>
          <FileText className="h-6 w-6 text-gray-400" />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Table */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Riwayat Penjualan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.filteredSales.length > 0 ? (
                      filteredData.filteredSales.map((sale) => (
                        <tr key={sale.id}>
                          <td className="px-3 py-2">{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                          <td className="px-3 py-2">{sale.quantity}</td>
                          <td className="px-3 py-2 font-medium">{formatCurrency(sale.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                          Tidak ada data penjualan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expenses Table */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Riwayat Pengeluaran</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.filteredExpenses.length > 0 ? (
                      filteredData.filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="px-3 py-2">{new Date(expense.date).toLocaleDateString('id-ID')}</td>
                          <td className="px-3 py-2">{expense.name}</td>
                          <td className="px-3 py-2 font-medium">{formatCurrency(expense.amount)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                          Tidak ada data pengeluaran
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;