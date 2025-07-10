import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Pocket } from 'lucide-react';

// DIUBAH: Modal sekarang menerima prop `kantongList`
const AddTransaksiModal = ({ isOpen, onClose, onSave, transaction, kantongList }) => {

  const getInitialFormData = () => ({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'Pengeluaran',
    // DIUBAH: Nama field diubah menjadi kantong_id untuk konsistensi
    kantong_id: kantongList.length > 0 ? kantongList[0].id : '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
        if (transaction) {
            setFormData({
                date: transaction.date,
                amount: transaction.amount.toString(),
                type: transaction.type,
                kantong_id: transaction.kantong_id || (kantongList.length > 0 ? kantongList[0].id : ''),
            });
        } else {
            setFormData(getInitialFormData());
        }
    }
    // DIUBAH: Tambahkan kantongList sebagai dependency
  }, [isOpen, transaction, kantongList]);

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

    const dataToSave = {
      date: formData.date,
      amount: amount,
      type: formData.type,
    };
    
    if (formData.type === 'Pengeluaran') {
        if (!formData.kantong_id) {
            alert('Silakan pilih kantong untuk pengeluaran.');
            return;
        }
        dataToSave.kantong_id = formData.kantong_id;
    }

    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
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

          {/* Dari Kantong (untuk Pengeluaran) */}
          {formData.type === 'Pengeluaran' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Pocket size={16} className="inline mr-2" />Dari Kantong
              </label>
              <select name="kantong_id" value={formData.kantong_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                <option value="" disabled>-- Pilih Kantong --</option>
                {kantongList.map((kantong) => <option key={kantong.id} value={kantong.id}>{kantong.title}</option>)}
              </select>
            </div>
          )}

          {/* Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign size={16} className="inline mr-2" />Jumlah
            </label>
            <input type="number" name="amount" step="1" value={formData.amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" required />
          </div>

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