// HELPER: Fungsi untuk format mata uang
export const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

// HELPER: Fungsi untuk format tanggal
export const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

// DATA DUMMY: Kategori untuk form dan filter
export const categories = ['Pemasukan', 'Kebutuhan Pokok', 'Tagihan', 'Makanan', 'Transportasi', 'Hiburan', 'Gaji', 'Bonus', 'Penjualan', 'Lainnya'];

// DATA DUMMY: Transaksi awal
export const mockTransactions = [
    { id: '1', date: '2025-07-05', description: 'Gaji Bulanan', category: 'Pemasukan', type: 'Pemasukan', amount: 5000000 },
    { id: '2', date: '2025-07-05', description: 'Belanja Bulanan', category: 'Kebutuhan Pokok', type: 'Pengeluaran', amount: 1500000 },
    { id: '3', date: '2025-07-04', description: 'Bayar Listrik', category: 'Tagihan', type: 'Pengeluaran', amount: 350000 },
    { id: '4', date: '2025-06-20', description: 'Makan siang rapat', category: 'Makanan', type: 'Pengeluaran', amount: 150000 },
    { id: '5', date: '2025-06-15', description: 'Tiket Bioskop', category: 'Hiburan', type: 'Pengeluaran', amount: 100000 },
    { id: '6', date: '2025-06-10', description: 'Bensin Motor', category: 'Transportasi', type: 'Pengeluaran', amount: 75000 },
];

// DATA DUMMY: Anggaran
export const budgetData = [
  { id: 1, category: 'Makanan', budgeted: 2000000, spent: 1750000 },
  { id: 2, category: 'Transportasi', budgeted: 750000, spent: 800000 },
  { id: 3, category: 'Tagihan', budgeted: 1000000, spent: 950000 },
  { id: 4, category: 'Hiburan', budgeted: 500000, spent: 300000 },
];

// DATA DUMMY: Rekapitulasi Bulanan
export const monthlyData = [
  { month: 'Jan', income: 7000000, expenses: 4500000 },
  { month: 'Feb', income: 7200000, expenses: 5000000 },
  { month: 'Mar', income: 6800000, expenses: 4700000 },
  { month: 'Apr', income: 7500000, expenses: 5200000 },
  { month: 'Mei', income: 8000000, expenses: 6000000 },
  { month: 'Jun', income: 7800000, expenses: 5500000 },
];

// DATA DUMMY: Rekapitulasi Kategori
export const categoryData = [
  { name: 'Makanan', value: 1800000 },
  { name: 'Transportasi', value: 1000000 },
  { name: 'Tagihan', value: 900000 },
  { name: 'Hiburan', value: 800000 },
  { name: 'Kebutuhan Pokok', value: 1500000 },
];