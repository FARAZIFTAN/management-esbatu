import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Calculator, Package, Zap, TrendingUp } from 'lucide-react';
import { Sale } from '../types';
import { calculatePrice, formatCurrency } from '../utils/pricing';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';

interface SalesProps {
  sales: Sale[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onDeleteSale: (id: string) => void;
}

const Sales = ({ sales, onAddSale, onDeleteSale }: SalesProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string>('');
  
  const { showSuccess, showError } = useToast();
  const price = calculatePrice(quantity);

  const validateForm = () => {
    if (!quantity || quantity <= 0) {
      setFormErrors('Jumlah es batu harus lebih dari 0');
      return false;
    }
    if (quantity > 1000) {
      setFormErrors('Jumlah es batu maksimal 1000');
      return false;
    }
    setFormErrors('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError(formErrors);
      return;
    }

    try {
      setIsCalculating(true);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      onAddSale({
        quantity,
        totalPrice: price,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].slice(0, 5),
      });
      
      setQuantity(1);
      showSuccess(`Penjualan ${quantity} es batu berhasil ditambahkan!`);
    } catch (error) {
      showError('Gagal menambahkan penjualan. Silakan coba lagi.');
      console.error('Error adding sale:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteSale(deleteConfirm);
      showSuccess('Penjualan berhasil dihapus!');
      setDeleteConfirm(null);
    }
  };

  const getPriceBreakdown = (qty: number): Array<{
    type: string;
    count: number;
    unitPrice: number;
    total: number;
    icon: string;
  }> => {
    if (qty <= 0) return [];
    
    const breakdown: Array<{
      type: string;
      count: number;
      unitPrice: number;
      total: number;
      icon: string;
    }> = [];
    let remaining = qty;
    
    // 6 packs
    const sixPacks = Math.floor(remaining / 6);
    if (sixPacks > 0) {
      breakdown.push({
        type: 'Paket 6 Es Batu',
        count: sixPacks,
        unitPrice: 10000,
        total: sixPacks * 10000,
        icon: '📦'
      });
      remaining -= sixPacks * 6;
    }
    
    // 3 packs
    const threePacks = Math.floor(remaining / 3);
    if (threePacks > 0) {
      breakdown.push({
        type: 'Paket 3 Es Batu',
        count: threePacks,
        unitPrice: 5000,
        total: threePacks * 5000,
        icon: '📋'
      });
      remaining -= threePacks * 3;
    }
    
    // Single pieces
    if (remaining > 0) {
      breakdown.push({
        type: 'Es Batu Satuan',
        count: remaining,
        unitPrice: 2000,
        total: remaining * 2000,
        icon: '❄️'
      });
    }
    
    return breakdown;
  };

  const todaySales = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const todayQuantity = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Penjualan Es Batu
          </h1>
          <p className="text-gray-600 mt-1">Catat setiap penjualan dengan sistem perhitungan otomatis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">Penjualan Hari Ini</p>
              <p className="text-sm font-bold text-blue-600">{todayQuantity} Es Batu</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Hari Ini</p>
              <p className="text-sm font-bold text-emerald-600">{formatCurrency(todayTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Sales Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Input Penjualan Baru</h2>
              <p className="text-gray-600 text-sm">Masukkan jumlah es batu yang dibeli pelanggan</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
            <Calculator className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Auto Calculate</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Jumlah Es Batu yang Dibeli
                </label>
                {formErrors && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{formErrors}</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Contoh: 15"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Jumlah Cepat:</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 6, 10, 15, 20, 30].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setQuantity(amount)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                        quantity === amount
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Result */}
            <div className="space-y-4">
              {quantity > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-800">Perhitungan Otomatis</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {getPriceBreakdown(quantity).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.count}× {item.type}
                            </div>
                            <div className="text-sm text-gray-600">
                              @{formatCurrency(item.unitPrice)} per {item.type.includes('Satuan') ? 'pcs' : 'paket'}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-emerald-700">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-emerald-200 mt-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-emerald-800">Total Pembayaran:</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(price)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={quantity <= 0 || isCalculating}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 font-semibold text-lg group"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Simpan Penjualan</span>
                <TrendingUp className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Enhanced Sales History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Riwayat Penjualan</h2>
              <p className="text-gray-600 text-sm mt-1">Daftar semua transaksi penjualan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Jumlah Es Batu
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Total Harga
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(sale.date).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">{sale.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{sale.quantity}</div>
                          <div className="text-xs text-gray-500">Es Batu</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-emerald-600">
                        {formatCurrency(sale.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Penjualan</h3>
                        <p className="text-gray-500">Mulai catat penjualan pertama Anda</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pricing Reference */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-800">Panduan Harga Es Batu</h3>
            <p className="text-indigo-600 text-sm">Sistem pricing otomatis untuk hasil optimal</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3">❄️</div>
              <div className="text-2xl font-bold text-indigo-800 mb-2">1 Es Batu</div>
              <div className="text-xl font-bold text-emerald-600">Rp 2.000</div>
              <div className="text-sm text-gray-600 mt-2">Pembelian satuan</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all duration-300 group relative">
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
              HEMAT
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-2xl font-bold text-indigo-800 mb-2">3 Es Batu</div>
              <div className="text-xl font-bold text-emerald-600">Rp 5.000</div>
              <div className="text-sm text-gray-600 mt-2">Paket kecil</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all duration-300 group relative">
            <div className="absolute -top-2 -right-2 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              TERBAIK
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-2xl font-bold text-indigo-800 mb-2">6 Es Batu</div>
              <div className="text-xl font-bold text-emerald-600">Rp 10.000</div>
              <div className="text-sm text-gray-600 mt-2">Paket besar</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/70 rounded-xl border border-indigo-200">
          <p className="text-sm text-indigo-700 text-center">
            💡 <strong>Tips:</strong> Sistem otomatis menghitung kombinasi terbaik untuk pembelian dalam jumlah besar, 
            memberikan harga yang paling menguntungkan untuk pelanggan.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        title="Hapus Penjualan"
        message="Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};

export default Sales;