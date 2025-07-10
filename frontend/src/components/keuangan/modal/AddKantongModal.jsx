import React, { useState } from 'react';
// DIUBAH: DollarSign dihapus karena input saldo awal dihilangkan
import { X, Pocket, Plus } from 'lucide-react';

const AddKantongModal = ({ isOpen, onClose, onSave }) => {
    // DIUBAH: State untuk amount/saldo awal dihilangkan
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) {
            alert('Nama kantong harus diisi.');
            return;
        }
        // DIUBAH: Hanya mengirim 'title' karena 'amount' tidak lagi diinput di sini
        onSave({
            title: title,
            // Saldo awal akan selalu 0 saat kantong baru dibuat
            amount: 0,
        });
        onClose();
        setTitle('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tambah Kantong Baru</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nama Kantong */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Pocket size={16} className="inline mr-2" />Nama Kantong
                        </label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Contoh: Dompet, Rekening BCA, dll." 
                            required 
                        />
                    </div>

                    {/* DIHILANGKAN: Bagian input Saldo Awal dihapus dari form */}

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500">Batal</button>
                        <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Plus size={18} />
                            Simpan Kantong
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddKantongModal;
