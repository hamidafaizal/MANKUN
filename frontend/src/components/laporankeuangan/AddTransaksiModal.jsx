import React, { useState, useEffect } from 'react';
// DIUBAH: Mengimpor ikon baru untuk form input
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

// Kategori didefinisikan di sini untuk digunakan di modal
const categories = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Kebutuhan Pokok', 'Gaji', 'Bonus', 'Penjualan', 'Lainnya'];

const AddTransaksiModal = ({ isOpen, onClose, onSave, transaction }) => {
  // DIUBAH: Menggunakan satu state object untuk form data, seperti pada referensi
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Makanan',
    type: 'Pengeluaran',
  });

  // DIUBAH: Logika useEffect disesuaikan dengan state formData
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Mode Edit
        setFormData({
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount.toString(),
          category: transaction.category,
          type: transaction.type,
        });
      } else {
        // Mode Tambah
        setFormData({
          date: new Date().toISOString().split('T')[0],
          description: '',
          amount: '',
          category: 'Makanan',
          type: 'Pengeluaran',
        });
      }
    }
  }, [isOpen, transaction]);

  // Fungsi untuk menangani perubahan pada semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Jumlah transaksi harus berupa angka dan lebih besar dari 0.");
      return;
    }

    // Mengirim data yang sudah diformat ke fungsi onSave
    onSave({
      date: formData.date,
      description: formData.description,
      amount: amount, // Jumlah tetap positif
      category: formData.category,
      type: formData.type,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    // DIUBAH: Tampilan modal disesuaikan dengan referensi
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {transaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipe Transaksi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Transaksi</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="type" value="Pengeluaran" checked={formData.type === 'Pengeluaran'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Pengeluaran</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="type" value="Pemasukan" checked={formData.type === 'Pemasukan'} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Pemasukan</span>
              </label>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-2" />Tanggal
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="inline mr-2" />Deskripsi
            </label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan deskripsi" required />
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign size={16} className="inline mr-2" />Jumlah
            </label>
            <input type="number" name="amount" step="1" value={formData.amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" required />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag size={16} className="inline mr-2" />Kategori
            </label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">{transaction ? 'Perbarui' : 'Tambah'} Transaksi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaksiModal;
