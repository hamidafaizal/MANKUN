import React from 'react';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';

// Helper function untuk format mata uang
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

// Data dummy untuk anggaran
const budgetData = [
  { id: 1, category: 'Makanan & Minuman', budgeted: 2000000, spent: 1750000 },
  { id: 2, category: 'Transportasi', budgeted: 750000, spent: 800000 },
  { id: 3, category: 'Tagihan & Utilitas', budgeted: 1000000, spent: 950000 },
  { id: 4, category: 'Hiburan', budgeted: 500000, spent: 300000 },
];

// Komponen Card untuk konsistensi tampilan
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

const AnggaranTab = () => {
  // Menambahkan properti 'remaining' ke setiap item
  const budgetsWithRemaining = budgetData.map(item => ({
    ...item,
    remaining: item.budgeted - item.spent,
  }));

  const totalBudgeted = budgetsWithRemaining.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetsWithRemaining.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Ringkasan Anggaran</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Pantau pengeluaran Anda terhadap anggaran</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>Kategori Anggaran</span>
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Dianggarkan</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalBudgeted)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-full">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Digunakan</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 p-3 rounded-full">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sisa</p>
              <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(totalRemaining)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 p-3 rounded-full">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Categories List */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori Anggaran</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rincian pengeluaran per kategori.</p>
        </div>
        <div className="space-y-6">
          {budgetsWithRemaining.map((item) => {
            const percentage = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
            const isOverBudget = item.spent > item.budgeted;
            
            return (
              <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200">{item.category}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.spent)} dari {formatCurrency(item.budgeted)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatCurrency(item.remaining)}
                    </p>
                    <p className="text-sm text-gray-500">sisa</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {percentage.toFixed(0)}% digunakan
                  </span>
                  {isOverBudget && (
                    <span className="text-sm text-red-600 font-medium">
                      Melebihi {formatCurrency(Math.abs(item.remaining))}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnggaranTab;
