import { useState } from 'react';
import { ShoppingBag, Plus, Trash2, DollarSign, Calendar, Tag, TrendingUp, CreditCard, Loader2 } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/pricing';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

const Expenses = ({ expenses, onAddExpense, onDeleteExpense }: ExpensesProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Nama pengeluaran harus diisi';
    } else if (name.trim().length < 3) {
      errors.name = 'Nama pengeluaran minimal 3 karakter';
    }
    
    if (!amount || amount <= 0) {
      errors.amount = 'Nominal harus lebih dari 0';
    } else if (amount > 100000000) {
      errors.amount = 'Nominal maksimal Rp 100.000.000';
    }
    
    if (!date) {
      errors.date = 'Tanggal harus diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Mohon perbaiki kesalahan pada form');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onAddExpense({
        name: name.trim(),
        amount: Number(amount),
        date,
      });
      
      setName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setFormErrors({});
      showSuccess(`Pengeluaran "${name.trim()}" berhasil ditambahkan!`);
    } catch (error) {
      showError('Gagal menambahkan pengeluaran. Silakan coba lagi.');
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteExpense(deleteConfirm);
      showSuccess('Pengeluaran berhasil dihapus!');
      setDeleteConfirm(null);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengeluaran</h1>
        <p className="text-gray-600">Catat semua pengeluaran usaha es batu</p>
      </div>

      {/* Expense Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tambah Pengeluaran</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pengeluaran
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors ${
                  formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-red-500'
                }`}
                placeholder="Contoh: Listrik, Air, Bahan bakar"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominal
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors ${
                  formErrors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-red-500'
                }`}
                placeholder="Masukkan jumlah pengeluaran"
              />
              {formErrors.amount && (
                <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 transition-colors ${
                formErrors.date ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-red-500'
              }`}
            />
            {formErrors.date && (
              <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Tambah Pengeluaran</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Summary Card */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Total Pengeluaran</h3>
        <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Pengeluaran</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pengeluaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data pengeluaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        title="Hapus Pengeluaran"
        message="Apakah Anda yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};

export default Expenses;