import React, { useState } from 'react';
import { X, User, Smartphone, Percent } from 'lucide-react';

const TambahInvestorModal = ({ isOpen, onClose, onSave }) => {
    // DIUBAH: Nama state disesuaikan dengan kolom database
    const [formData, setFormData] = useState({
        name: '',
        hp_units: '',
        profit_share: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.hp_units || !formData.profit_share) {
            alert('Semua field harus diisi.');
            return;
        }
        // Mengirim data ke parent untuk diproses (dikirim ke API)
        onSave(formData);
        onClose();
        // Reset form setelah submit
        setFormData({ name: '', hp_units: '', profit_share: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tambah Investor Baru</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <User size={16} className="inline mr-2" />Nama Investor
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Masukkan nama lengkap" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Smartphone size={16} className="inline mr-2" />Jumlah Unit HP
                        </label>
                        <input 
                            type="number" 
                            name="hp_units" 
                            value={formData.hp_units} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="0" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Percent size={16} className="inline mr-2" />Pembagian Laba (%)
                        </label>
                        <input 
                            type="number" 
                            name="profit_share" 
                            value={formData.profit_share} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="0" 
                            required 
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500">Batal</button>
                        <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simpan Investor</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahInvestorModal;
