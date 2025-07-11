import React, { useState, useEffect } from 'react';
import { Pocket, DollarSign, Plus, Trash2, Users } from 'lucide-react';
import { formatCurrency } from '../data';
import Card from '../components/Card';
import AddKantongModal from '../modal/AddKantongModal';
import api from '../../../api';

// Komponen untuk card kantong biasa
const KantongCard = ({ icon: Icon, title, amount, onDelete }) => (
    <Card>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatCurrency(parseFloat(amount))}</p>
                </div>
            </div>
            {onDelete && (
                <button 
                  onClick={onDelete} 
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors opacity-50 hover:opacity-100"
                  title={`Hapus ${title}`}
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    </Card>
);

// DIUBAH: Komponen untuk card kantong investor sekarang menampilkan saldo
const InvestorKantongCard = ({ icon: Icon, name, share, amount }) => (
    <Card>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatCurrency(parseFloat(amount))}</p>
                </div>
            </div>
            <p className="text-lg font-medium text-purple-600 dark:text-purple-400">{parseInt(share)}%</p>
        </div>
    </Card>
);

const SaldoTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saldoUtama, setSaldoUtama] = useState(null);
    const [daftarKantong, setDaftarKantong] = useState([]);
    const [investorList, setInvestorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // DIUBAH: Logika pengambilan dan pemisahan data diperbarui
    const fetchData = async () => {
        try {
            setLoading(true);
            const [kantongsRes, investorsRes] = await Promise.all([
                api.get('/kantongs'),
                api.get('/investors')
            ]);
            
            const allKantongs = kantongsRes.data;
            const allInvestors = investorsRes.data;
            const investorNames = allInvestors.map(inv => inv.name);

            const main = allKantongs.find(k => !k.is_deletable);
            // Hanya tampilkan kantong yang bisa dihapus & bukan milik investor
            const operationalKantongs = allKantongs.filter(k => k.is_deletable && !investorNames.includes(k.title));
            
            // Buat pemetaan dari nama investor ke saldo kantongnya
            const investorKantongMap = allKantongs.reduce((acc, kantong) => {
                if (investorNames.includes(kantong.title)) {
                    acc[kantong.title] = kantong.amount;
                }
                return acc;
            }, {});

            // Gabungkan data investor dengan data saldo mereka
            const investorsWithBalance = allInvestors.map(investor => ({
                ...investor,
                amount: investorKantongMap[investor.name] || 0
            }));

            setSaldoUtama(main);
            setDaftarKantong(operationalKantongs);
            setInvestorList(investorsWithBalance);
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

    const handleSaveKantong = async (newKantongData) => {
        try {
            await api.post('/kantongs', newKantongData);
            fetchData();
        } catch (err) {
            alert("Gagal menyimpan data. Pastikan nama kantong belum ada.");
            console.error(err);
        }
    };

    const handleDeleteKantong = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kantong ini?")) {
            try {
                await api.delete(`/kantongs/${id}`);
                fetchData();
            } catch (err) {
                alert("Gagal menghapus kantong.");
                console.error(err);
            }
        }
    };
  
    if (loading) return <div className="text-center p-10">Memuat data...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <>
            <AddKantongModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveKantong}
            />
            <div className="space-y-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Saldo</h2>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={18} />
                        <span>Tambah Kantong</span>
                    </button>
                </div>
                
                {saldoUtama && (
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{saldoUtama.title}</p>
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(parseFloat(saldoUtama.amount))}</p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 p-4 bg-white/50 dark:bg-blue-900/50 rounded-full">
                                <DollarSign size={32}/>
                            </div>
                        </div>
                    </Card>
                )}

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daftar Kantong Saldo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {daftarKantong.length > 0 ? daftarKantong.map(kantong => (
                            <KantongCard 
                                key={kantong.id}
                                icon={Pocket}
                                title={kantong.title}
                                amount={kantong.amount}
                                onDelete={() => handleDeleteKantong(kantong.id)}
                            />
                        )) : (
                            <p className="col-span-full text-center text-gray-500">Belum ada kantong tambahan.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daftar Kantong Investor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* DIUBAH: Looping sekarang menggunakan investorList yang sudah memiliki data saldo */}
                        {investorList.length > 0 ? investorList.map(investor => (
                            <InvestorKantongCard 
                                key={investor.id}
                                icon={Users}
                                name={investor.name}
                                share={investor.profit_share}
                                amount={investor.amount}
                            />
                        )) : (
                            <p className="col-span-full text-center text-gray-500">Belum ada data investor.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaldoTab;