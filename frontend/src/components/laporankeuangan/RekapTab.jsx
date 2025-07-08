import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { MonthlyBarChart, CategoryPieChart } from './Charts';

// Komponen Card lokal untuk konsistensi UI
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

// Data dummy lokal
const monthlyData = [
  { month: 'Januari', income: 7000000, expenses: 4500000 },
  { month: 'Februari', income: 7200000, expenses: 5000000 },
  { month: 'Maret', income: 6800000, expenses: 4700000 },
  { month: 'April', income: 7500000, expenses: 5200000 },
  { month: 'Mei', income: 8000000, expenses: 6000000 },
  { month: 'Juni', income: 7800000, expenses: 5500000 },
];

const categoryData = [
  { category: 'Makanan', amount: 1800000, percentage: 40 },
  { category: 'Transportasi', amount: 1000000, percentage: 22 },
  { category: 'Tagihan', amount: 900000, percentage: 20 },
  { category: 'Hiburan', amount: 800000, percentage: 18 },
];

// Helper format mata uang
const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const RekapTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const periods = [
    { value: 'weekly', label: 'Mingguan' },
    { value: 'monthly', label: 'Bulanan' },
    { value: 'yearly', label: 'Tahunan' }
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Laporan Rekapitulasi</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Analisis data keuangan Anda.</p>
        </div>
        <div className="flex space-x-3">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full sm:w-auto appearance-none px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {periods.map((period) => <option key={period.value} value={period.value}>{period.label}</option>)}
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} className="mr-2" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Laporan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rata-rata Pemasukan</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(monthlyData.reduce((sum, month) => sum + month.income, 0) / monthlyData.length)}</p>
        </Card>
        <Card>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rata-rata Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(monthlyData.reduce((sum, month) => sum + month.expenses, 0) / monthlyData.length)}</p>
        </Card>
        <Card>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bulan Terboros</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{monthlyData.reduce((max, month) => month.expenses > max.expenses ? month : max, monthlyData[0]).month}</p>
        </Card>
        <Card>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kategori Teratas</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{categoryData[0].category}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pemasukan vs Pengeluaran</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analisis perbandingan arus kas.</p>
          </div>
          <MonthlyBarChart data={monthlyData} />
        </Card>
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribusi Pengeluaran</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rincian pengeluaran per kategori.</p>
          </div>
          <CategoryPieChart data={categoryData} />
        </Card>
      </div>
    </div>
  );
};

export default RekapTab;
