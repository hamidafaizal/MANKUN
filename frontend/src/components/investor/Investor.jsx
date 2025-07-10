import React, { useState, useEffect } from 'react';
import { Users, Smartphone, Percent, Plus, Trash2 } from 'lucide-react';
import TambahInvestorModal from './TambahInvestorModal';
import api from '../../api'; // Mengimpor instance API

const Card = ({ children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        {children}
    </div>
);

const Investor = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvestors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/investors');
            setInvestors(response.data);
            setError(null);
        } catch (err) {
            setError("Gagal mengambil data investor.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestors();
    }, []);

    const handleSaveInvestor = async (newInvestor) => {
        try {
            await api.post('/investors', newInvestor);
            fetchInvestors();
        } catch (err) {
            alert('Gagal menyimpan investor. Periksa kembali data Anda.');
            console.error(err);
        }
    };
    
    const handleDeleteInvestor = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus investor ini?')) {
            try {
                await api.delete(`/investors/${id}`);
                fetchInvestors();
            } catch (err) {
                alert('Gagal menghapus investor.');
                console.error(err);
            }
        }
    };

    // DIUBAH: Perhitungan rata-rata sekarang menggunakan toFixed(0) untuk menghasilkan bilangan bulat
    const summaryData = [
        { title: 'Total Investor', value: investors.length, icon: Users, color: 'text-blue-500' },
        { title: 'Total Unit HP', value: investors.reduce((sum, inv) => sum + inv.hp_units, 0), icon: Smartphone, color: 'text-green-500' },
        { title: 'Rata-rata Pembagian', value: investors.length > 0 ? `${(investors.reduce((sum, inv) => sum + parseFloat(inv.profit_share), 0) / investors.length).toFixed(0)}%` : '0%', icon: Percent, color: 'text-purple-500' },
    ];

    if (loading) return <div className="text-center p-10">Memuat data investor...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <>
            <TambahInvestorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveInvestor} 
            />
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Investor</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Kelola data dan laporan untuk para investor Anda.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={18} />
                        <span>Tambah Investor</span>
                    </button>
                </div>

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

                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daftar Investor Aktif</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Nama Investor</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Jumlah HP</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">Pembagian (%)</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investors.map((investor) => (
                                    <tr key={investor.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{investor.name}</td>
                                        <td className="p-4 font-medium text-green-600 dark:text-green-400">{investor.hp_units}</td>
                                        {/* DIUBAH: Menggunakan parseInt untuk menampilkan bilangan bulat */}
                                        <td className="p-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{parseInt(investor.profit_share)}%</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDeleteInvestor(investor.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
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
