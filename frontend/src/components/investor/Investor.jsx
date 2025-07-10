import React, { useState } from 'react';
// DIUBAH: Menghapus BarChart2, menambahkan Smartphone dan Percent. Mengimpor modal baru.
import { Users, DollarSign, Smartphone, Percent, Plus } from 'lucide-react';
import TambahInvestorModal from './TambahInvestorModal';

const Card = ({ children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        {children}
    </div>
);

const Investor = () => {
    // DIUBAH: State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // DIUBAH: Data dummy awal disesuaikan
    const initialInvestors = [
        { id: 1, name: 'Budi Hartono', joined: '15 Jan 2024', hp_units: 25, profit_share: '50' },
        { id: 2, name: 'Siti Aminah', joined: '02 Mar 2024', hp_units: 15, profit_share: '45' },
        { id: 3, name: 'Joko Susilo', joined: '20 Mei 2024', hp_units: 30, profit_share: '55' },
        { id: 4, name: 'Dewi Lestari', joined: '11 Jun 2024', hp_units: 10, profit_share: '40' },
    ];
    
    const [investors, setInvestors] = useState(initialInvestors);

    // DIUBAH: Data ringkasan disesuaikan
    const summaryData = [
        { title: 'Total Investor', value: investors.length, icon: Users, color: 'text-blue-500' },
        { title: 'Total Unit HP', value: investors.reduce((sum, inv) => sum + inv.hp_units, 0), icon: Smartphone, color: 'text-green-500' },
        { title: 'Rata-rata Pembagian', value: `${(investors.reduce((sum, inv) => sum + parseFloat(inv.profit_share), 0) / investors.length).toFixed(1)}%`, icon: Percent, color: 'text-purple-500' },
    ];

    // DIUBAH: Fungsi untuk menyimpan investor baru
    const handleSaveInvestor = (newInvestor) => {
        setInvestors([newInvestor, ...investors]);
    };

    return (
        <>
            <TambahInvestorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveInvestor} 
            />
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Investor</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Kelola data dan laporan untuk para investor Anda.</p>
                    </div>
                    {/* DIUBAH: Tombol sekarang membuka modal */}
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={18} />
                        <span>Tambah Investor</span>
                    </button>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summaryData.map((item, index) => (
                        <Card key={index}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Daftar Investor */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daftar Investor Aktif</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Nama Investor</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">Bergabung</th>
                                    {/* DIUBAH: Kolom diubah */}
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Jumlah HP</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">Pembagian (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investors.map((investor) => (
                                    <tr key={investor.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{investor.name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 hidden md:table-cell">{investor.joined}</td>
                                        {/* DIUBAH: Data disesuaikan */}
                                        <td className="p-4 font-medium text-green-600 dark:text-green-400">{investor.hp_units}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{investor.profit_share}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Investor;