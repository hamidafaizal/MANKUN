import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
// DIUBAH: Import SettingsModal dihapus

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  // DIUBAH: State untuk modal settings dihapus

  const toggleSidebarPin = () => {
    setIsSidebarPinned(!isSidebarPinned);
  };

  return (
    // DIUBAH: <></> dihapus karena tidak lagi diperlukan
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isPinned={isSidebarPinned}
        togglePin={toggleSidebarPin}
        // DIUBAH: Prop untuk membuka modal dihapus
      />
      <MainContent 
        activePage={activePage} 
        toggleSidebarPin={toggleSidebarPin}
      />
      {/* DIUBAH: Komponen modal dihapus dari sini */}
    </div>
  );
}

export default App;