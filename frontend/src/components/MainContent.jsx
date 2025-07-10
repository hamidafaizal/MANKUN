import React from 'react';
import Dashboard from './dashboard/Dashboard.jsx';
import HPManage from './hpmanage/HPManage.jsx';
import NomerSellulerManage from './nomersellulermanage/NomerSellulerManage.jsx';
import AkunShopee from './akunshopee/AkunShopee.jsx';
import AkunNPWP from './akunnpwp/AkunNPWP.jsx';
import LaporanKeuangan from './keuangan/LaporanKeuangan.jsx'; 
import Investor from './investor/Investor.jsx';
import Settings from './settings/Settings.jsx'; // <-- TAMBAHKAN INI
import { Menu, UserCircle } from 'lucide-react';

const MainContent = ({ activePage, toggleSidebarPin }) => {

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'HP Manage':
                return <HPManage />;
            case 'Nomer Selluler Manage':
                return <NomerSellulerManage />;
            case 'Akun Shopee':
                return <AkunShopee />;
            case 'Akun NPWP':
                return <AkunNPWP />;
            case 'Keuangan':
                return <LaporanKeuangan />;
            case 'Investor':
                return <Investor />;
            // DIUBAH: Menambahkan case untuk halaman 'Settings'
            case 'Settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <main className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto">
            <header className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebarPin} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{activePage}</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                         <UserCircle className="w-8 h-8 text-gray-500 dark:text-gray-400"/>
                    </button>
                </div>
            </header>
            
            <div className="p-4 md:p-6">
              {renderContent()}
            </div>
        </main>
    );
};

export default MainContent;