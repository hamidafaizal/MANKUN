import React, { useState, useEffect } from 'react';
import { Pocket, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '../data';
import Card from '../components/Card';
import AddKantongModal from '../modal/AddKantongModal';
import api from '../../../api'; // <-- DIUBAH: Mengimpor instance API

// Komponen untuk setiap card kantong
const KantongCard = ({ icon: Icon, title, amount }) => (
    <Card>
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatCurrency(parseFloat(amount))}</p>
            </div>
        </div>
    </Card>
);

const SaldoTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kantongList, setKantongList] = useState([]);
  // DIUBAH: Menambahkan state untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DIUBAH: Mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchKantongs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/kantongs');
        setKantongList(response.data);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKantongs();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // DIUBAH: Fungsi ini sekarang mengirim data ke API
  const handleSaveKantong = async (newKantongData) => {
    try {
      const response = await api.post('/kantongs', newKantongData);
      setKantongList(prevList => [...prevList, response.data]);
    } catch (err) {
      alert("Gagal menyimpan data. Pastikan nama kantong belum ada.");
      console.error(err);
    }
  };

  const totalSaldo = kantongList.reduce((sum, kantong) => sum + parseFloat(kantong.amount), 0);
  
  // DIUBAH: Tampilan saat loading atau error
  if (loading) {
    return <div className="text-center p-10">Memuat data kantong...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <AddKantongModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveKantong}
      />
      <div className="space-y-6 mt-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Saldo</h2>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  <span>Tambah Kantong</span>
              </button>
          </div>
          
          {/* Ringkasan Saldo Utama */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Saldo Utama</p>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalSaldo)}</p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 p-4 bg-white/50 dark:bg-blue-900/50 rounded-full">
                      <DollarSign size={32}/>
                  </div>
              </div>
          </Card>

          {/* Daftar Kantong */}
          <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daftar Kantong</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kantongList.length > 0 ? kantongList.map(kantong => (
                      <KantongCard 
                          key={kantong.id}
                          icon={Pocket} // Ikon default, bisa diubah nanti
                          title={kantong.title}
                          amount={kantong.amount}
                      />
                  )) : (
                    <p className="col-span-full text-center text-gray-500">Belum ada kantong. Silakan tambahkan.</p>
                  )}
              </div>
          </div>
      </div>
    </>
  );
};

export default SaldoTab;