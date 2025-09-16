import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Activity, Target } from 'lucide-react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils/pricing';
import { SalesChart, SummaryPieChart, MiniChart, ChartTypeSelector } from './Chart';

interface DashboardProps {
  stats: DashboardStats;
  dailySales: Array<{
    date: string;
    amount: number;
    quantity: number;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, dailySales }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const last7Days: Array<{
      name: string;
      penjualan: number;
      pengeluaran: number;
      laba: number;
      tanggal: string;
    }> = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find sales for this date
      const dayData = dailySales.find(d => d.date === dateStr);
      const penjualan = dayData?.amount || 0;
      
      // Generate some mock expense data for demo (in real app, this would come from props)
      const pengeluaran = Math.floor(Math.random() * penjualan * 0.3);
      const laba = penjualan - pengeluaran;
      
      last7Days.push({
        name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        penjualan,
        pengeluaran,
        laba,
        tanggal: dateStr
      });
    }
    
    return last7Days;
  }, [dailySales]);

  // Generate pie chart data
  const pieChartData = useMemo(() => [
    { name: 'Saldo', value: stats.balance, color: '#3b82f6' },
    { name: 'Pemasukan', value: stats.totalIncome, color: '#10b981' },
    { name: 'Pengeluaran', value: stats.totalExpenses, color: '#ef4444' },
  ], [stats]);

  // Generate mini chart data for cards
  const miniChartData = useMemo(() => {
    return chartData.map(d => d.penjualan);
  }, [chartData]);

  const statCards = [
    {
      title: 'Total Pemasukan',
      value: stats.totalIncome,
      icon: TrendingUp,
      change: '+12.5%',
      changeType: 'positive' as const,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      miniData: miniChartData,
      color: '#10b981'
    },
    {
      title: 'Total Pengeluaran',
      value: stats.totalExpenses,
      icon: TrendingDown,
      change: '+3.2%',
      changeType: 'negative' as const,
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      miniData: chartData.map(d => d.pengeluaran),
      color: '#ef4444'
    },
    {
      title: 'Saldo Tersedia',
      value: stats.balance,
      icon: DollarSign,
      change: '+8.1%',
      changeType: 'positive' as const,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      miniData: chartData.map(d => d.laba),
      color: '#3b82f6'
    },
    {
      title: 'Laba Bersih',
      value: stats.profit,
      icon: BarChart3,
      change: '+15.3%',
      changeType: 'positive' as const,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      miniData: chartData.map(d => d.laba),
      color: '#8b5cf6'
    },
  ];

  const maxAmount = Math.max(...dailySales.map(d => d.amount), 1);
  const avgDailySales = dailySales.reduce((sum, day) => sum + day.amount, 0) / dailySales.length || 0;

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Pantau performa bisnis es batu Anda secara real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Live Data</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const ChangeIcon = card.changeType === 'positive' ? ArrowUpRight : ArrowDownRight;
          return (
            <div 
              key={index} 
              className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Icon className="w-full h-full" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <ChangeIcon className="h-3 w-3" />
                    <span>{card.change}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(card.value)}
                    </p>
                  </div>
                  
                  {/* Mini Chart */}
                  <div className="h-12">
                    <MiniChart 
                      data={card.miniData} 
                      color={card.color}
                      type="area"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Sales Chart with Modern Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Analisis Keuangan</h2>
                  <p className="text-gray-600 text-sm">Trend penjualan, pengeluaran, dan laba</p>
                </div>
                <ChartTypeSelector 
                  currentType={chartType}
                  onTypeChange={setChartType}
                />
              </div>
            </div>
            <div className="p-2">
              <SalesChart data={chartData} type={chartType} />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-1">
          <SummaryPieChart data={pieChartData} />
        </div>
      </div>

      {/* Daily Sales Breakdown */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Breakdown Harian</h2>
            <p className="text-gray-600">Detail penjualan per hari dengan visualisasi</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Rata-rata Harian</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(avgDailySales)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total 7 Hari</p>
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(dailySales.reduce((sum, day) => sum + day.amount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {dailySales.length > 0 ? (
            <>
              {dailySales.map((day, index) => {
                const percentage = (day.amount / maxAmount) * 100;
                const isHighest = day.amount === maxAmount && maxAmount > 0;
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-700 w-20">
                          {new Date(day.date).toLocaleDateString('id-ID', { 
                            weekday: 'short',
                            day: '2-digit', 
                            month: 'short' 
                          })}
                        </div>
                        {isHighest && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <Target className="h-3 w-3" />
                            <span>Tertinggi</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(day.amount)}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-6 rounded-full transition-all duration-1000 ease-out relative ${
                            isHighest 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          } group-hover:from-blue-600 group-hover:to-indigo-600`}
                          style={{ 
                            width: `${percentage}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          {percentage > 20 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-white opacity-80">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Penjualan</h3>
              <p className="text-gray-500 mb-4">Mulai catat penjualan pertama Anda untuk melihat grafik</p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                Tambah Penjualan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900">Performa Terbaik</h3>
          </div>
          <p className="text-blue-700 text-sm">
            {dailySales.length > 0 && maxAmount > 0 
              ? `Penjualan tertinggi: ${formatCurrency(maxAmount)}`
              : 'Belum ada data penjualan'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-emerald-900">Target Harian</h3>
          </div>
          <p className="text-emerald-700 text-sm">
            Target: Rp 500.000/hari
            <br />
            <span className="font-medium">
              {avgDailySales >= 500000 ? '✅ Target tercapai!' : `Kurang ${formatCurrency(500000 - avgDailySales)}`}
            </span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-purple-900">Status Operasional</h3>
          </div>
          <p className="text-purple-700 text-sm">
            {stats.balance > 0 ? (
              <>🟢 Bisnis berjalan sehat<br />Cash flow positif</>
            ) : (
              <>🟡 Perlu perhatian<br />Pantau pengeluaran</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;