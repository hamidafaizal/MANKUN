import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import MainContent from './components/MainContent.jsx';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  // DIUBAH: State diubah untuk mengontrol apakah sidebar 'disematkan' (pinned) atau tidak.
  // Nilai default 'true' berarti sidebar akan terbuka penuh saat aplikasi pertama kali dimuat.
  const [isSidebarPinned, setSidebarPinned] = useState(true);

  // DIUBAH: Fungsi ini sekarang untuk mengubah status pin sidebar.
  const toggleSidebarPin = () => {
    setSidebarPinned(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-50">
      {/* DIUBAH: Meneruskan state 'isPinned' dan fungsi 'toggleSidebarPin' ke Sidebar. */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isPinned={isSidebarPinned}
        togglePin={toggleSidebarPin}
      />
      {/* DIUBAH: Meneruskan fungsi 'toggleSidebarPin' yang sudah diperbarui ke MainContent. */}
      <MainContent 
        activePage={activePage} 
        toggleSidebarPin={toggleSidebarPin}
      />
    </div>
  );
}

export default App;
