import React, { useState } from 'react';
import TransaksiTab from './TransaksiTab';
import AnggaranTab from './AnggaranTab';
// DIUBAH: Mengimpor komponen RekapTab yang baru
import RekapTab from './RekapTab';

const LaporanKeuangan = () => {
  const [activeTab, setActiveTab] = useState('Transaksi');
  const tabs = ['Transaksi', 'Anggaran', 'Rekap'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Transaksi':
        return <TransaksiTab />;
      case 'Anggaran':
        return <AnggaranTab />;
      // DIUBAH: Menggunakan komponen RekapTab
      case 'Rekap':
        return <RekapTab />;
      default:
        return <TransaksiTab />;
    }
  };

  return (
    <div className="p-0 md:p-0">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Keuangan
      </h1>
      
      <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default LaporanKeuangan;
