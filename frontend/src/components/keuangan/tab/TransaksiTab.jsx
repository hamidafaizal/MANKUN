import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import AddTransaksiModal from '../modal/AddTransaksiModal';
import Card from '../components/Card';
import { formatCurrency, formatDate } from '../data';
import api from '../../../api';

const TransaksiTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [kantongList, setKantongList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [transaksiResponse, kantongResponse] = await Promise.all([
        api.get('/transaksis'),
        api.get('/kantongs')
      ]);
      setTransactions(transaksiResponse.data);
      setKantongList(kantongResponse.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data dari server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTransaction = async (transactionData) => {
    try {
        if (editingTransaction) {
            await api.put(`/transaksis/${editingTransaction.id}`, transactionData);
        } else {
            await api.post('/transaksis', transactionData);
        }
        fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Gagal menyimpan transaksi.";
      alert(errorMessage);
      console.error(err);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus transaksi ini? Tindakan ini akan mempengaruhi saldo kantong terkait.")) {
        try {
            await api.delete(`/transaksis/${id}`);
            fetchData();
        } catch (err) {
            alert('Gagal menghapus transaksi.');
            console.error(err);
        }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  if (loading) return <div className="text-center p-10">Memuat data transaksi...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Daftar Transaksi</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
          <Plus size={18} />
          <span>Tambah Transaksi</span>
        </button>
      </div>
      
      <Card>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8"><p className="text-gray-500">Belum ada transaksi.</p></div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'Pemasukan' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {transaction.type === 'Pemasukan' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-200">
                      {transaction.type === 'Pemasukan' ? 'Pemasukan Otomatis' : `Pengeluaran dari ${transaction.kantong ? transaction.kantong.title : 'N/A'}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <p className={`font-semibold text-lg ${transaction.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(parseFloat(transaction.amount))}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                    <button onClick={() => handleEdit(transaction)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(transaction.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <AddTransaksiModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveTransaction} 
        transaction={editingTransaction}
        kantongList={kantongList}
      />
    </div>
  );
};

export default TransaksiTab;