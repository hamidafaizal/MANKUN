import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // DIHAPUS: Koneksi ke axios dihapus
import { Plus } from 'lucide-react';

import AddNPWPModal from './AddNPWPModal.jsx';
import NPWPCard from './NPWPCard.jsx';
import NPWPDetailModal from './NPWPDetailModal.jsx';

// DIHAPUS: URL API tidak lagi digunakan
// const API_URL = 'http://localhost:8000/api';

// DIUBAH: Menambahkan data dummy untuk pengembangan frontend
const dummyData = [
  {
    id: 1,
    nama_pemilik: 'Hamida Faizal',
    nomer_rekening: '1234567890',
    email_pemilik: 'hamida@example.com',
    foto_npwp_path: 'placeholders/npwp.png',
    foto_ktp_path: 'placeholders/ktp.png',
    foto_buku_rekening_path: 'placeholders/rekening.png',
  },
  {
    id: 2,
    nama_pemilik: 'Putra Mbarep',
    nomer_rekening: '0987654321',
    email_pemilik: 'putra@example.com',
    foto_npwp_path: 'placeholders/npwp.png',
    foto_ktp_path: 'placeholders/ktp.png',
    foto_buku_rekening_path: 'placeholders/rekening.png',
  },
];

const AkunNPWP = () => {
  // DIUBAH: State diinisialisasi dengan data dummy
  const [npwpData, setNpwpData] = useState(dummyData);
  // DIUBAH: Loading diatur ke false karena tidak ada data yang diambil dari server
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNpwp, setSelectedNpwp] = useState(null);
  
  // DIHAPUS: Fungsi fetchData dan useEffect tidak lagi diperlukan
  /*
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/akun-npwp`);
      setNpwpData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data dari API:", error);
      alert("Gagal mengambil data dari server. Pastikan backend berjalan.");
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  */

  const handleOpenDetail = (data) => {
    setSelectedNpwp(data);
    setIsDetailModalOpen(true);
  };

  // DIUBAH: Fungsi ini sekarang menambahkan data baru ke state lokal, bukan memuat ulang dari server
  const handleSaveSuccess = (newData) => {
    setNpwpData(prevData => [
        ...prevData,
        {
            id: prevData.length + 1, // ID sementara
            ...newData,
        }
    ]);
  };

  return (
    <div className="p-6 md:p-8 h-full">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Manajemen Akun NPWP
      </h1>
      
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Memuat data...</p>
        ) : npwpData.length > 0 ? (
          npwpData.map(data => (
            <NPWPCard key={data.id} data={data} onClick={() => handleOpenDetail(data)} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Belum ada data. Silakan tambahkan data baru.</p>
        )}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-10 right-10 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-blue-700 focus:outline-none"
        aria-label="Tambah Akun NPWP"
        title="Tambah Akun NPWP"
      >
        <Plus size={28} />
      </button>

      <AddNPWPModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSaveSuccess={handleSaveSuccess} // DIUBAH: Menggunakan handler baru
      />

      <NPWPDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedNpwp}
      />
    </div>
  );
};

export default AkunNPWP;
