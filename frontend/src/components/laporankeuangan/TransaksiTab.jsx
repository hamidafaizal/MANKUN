import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import AddTransaksiModal from './AddTransaksiModal';

// HELPER: Komponen Card untuk membungkus bagian UI
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

// HELPER: Fungsi untuk format mata uang
const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

// HELPER: Fungsi untuk format tanggal
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

// DATA DUMMY: Kategori dan data transaksi awal
const mockTransactions = [
    { id: '1', date: '2025-07-05', description: 'Gaji Bulanan', category: 'Pemasukan', type: 'Pemasukan', amount: 5000000 },
    { id: '2', date: '2025-07-05', description: 'Belanja Bulanan', category: 'Kebutuhan Pokok', type: 'Pengeluaran', amount: 1500000 },
    { id: '3', date: '2025-07-04', description: 'Bayar Listrik', category: 'Tagihan', type: 'Pengeluaran', amount: 350000 },
];
const categories = ['Pemasukan', 'Kebutuhan Pokok', 'Tagihan', 'Makanan', 'Transportasi', 'Hiburan'];

const TransaksiTab = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(undefined);

  // Logika untuk memfilter transaksi
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const searchMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
      const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
      return searchMatch && categoryMatch && typeMatch;
    });
  }, [transactions, searchTerm, categoryFilter, typeFilter]);

  // Fungsi untuk menangani simpan (tambah atau edit)
  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      // Edit
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...transactionData, id: t.id } : t));
    } else {
      // Tambah
      const newTransaction = { ...transactionData, id: Date.now().toString() };
      setTransactions([newTransaction, ...transactions]);
    }
  };

  // Fungsi untuk menghapus transaksi
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Fungsi untuk membuka modal dalam mode edit
  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  
  // Fungsi untuk menutup modal dan mereset state edit
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Daftar Transaksi</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Kelola semua pemasukan dan pengeluaran Anda.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Filter */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari transaksi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Semua Tipe</option>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Daftar Transaksi */}
      <Card>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8"><p className="text-gray-500">Tidak ada transaksi ditemukan.</p></div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'Pemasukan' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {transaction.type === 'Pemasukan' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-200">{transaction.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} • {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                  <p className={`font-semibold text-lg ${transaction.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(transaction.amount)}</p>
                  <div className="flex space-x-1">
                    <button onClick={() => openEditModal(transaction)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteTransaction(transaction.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal untuk Tambah/Edit Transaksi */}
      <AddTransaksiModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTransaction} transaction={editingTransaction} />
    </div>
  );
};

export default TransaksiTab;
