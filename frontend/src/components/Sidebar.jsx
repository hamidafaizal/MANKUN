import React, { useState } from 'react';
import { 
    Menu, 
    Search,
    LayoutDashboard, 
    Smartphone, 
    Phone, 
    ShoppingBag, 
    Landmark, 
    BookCopy, // DIUBAH: Ikon ini sekarang akan digunakan untuk "Keuangan"
    Settings, 
    HelpCircle 
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, isPinned, togglePin }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = isPinned || isHovered;

    // DIUBAH: Item menu "Laporan Keuangan" diubah menjadi "Keuangan"
    const menuItems = [
        { icon: LayoutDashboard, name: 'Dashboard' },
        { icon: Smartphone, name: 'HP Manage' },
        { icon: Phone, name: 'Nomer Selluler Manage' },
        { icon: ShoppingBag, name: 'Akun Shopee' },
        { icon: Landmark, name: 'Akun NPWP' },
        { icon: BookCopy, name: 'Keuangan' }, // Nama telah diubah
    ];

    const bottomMenuItems = [
        { icon: HelpCircle, name: 'Help' },
        { icon: Settings, name: 'Settings' },
    ];

    return (
        <aside 
          className={`bg-gray-100 dark:bg-gray-800/90 flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-700/50 transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`p-4 flex items-center mb-6 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                <span className={`text-xl font-bold text-gray-800 dark:text-white transition-opacity duration-200 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>MANKUN</span>
                <button onClick={togglePin} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                </button>
            </div>
            
            <div className="px-4 mb-6">
                <div className={`relative flex items-center`}>
                    <Search className={`absolute w-5 h-5 text-gray-400 transition-all ${isExpanded ? 'left-3' : 'left-1/2 -translate-x-1/2'}`} />
                    <input 
                        type="text"
                        placeholder={isExpanded ? "Search" : ""}
                        className={`w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm transition-all duration-300
                        ${isExpanded ? 'pl-10 pr-4 py-2' : 'w-12 h-10 pl-10 cursor-pointer'}`}
                    />
                </div>
            </div>

            <nav className="flex-grow px-2 overflow-y-auto">
                <p className={`text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase transition-opacity whitespace-nowrap ${isExpanded ? 'px-2 opacity-100' : 'opacity-0 h-0'}`}>Menu</p>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setActivePage(item.name)}
                                className={`w-full flex items-center gap-3 p-2 rounded-full transition-colors text-left text-sm whitespace-nowrap ${
                                    activePage === item.name 
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60'
                                } ${isExpanded ? '' : 'justify-center'}`}
                                title={isExpanded ? '' : item.name}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                <span className={`transition-opacity ${isExpanded ? 'opacity-100 delay-200' : 'opacity-0 w-0'}`}>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto px-2 pb-2">
                 <nav>
                    <ul>
                        {bottomMenuItems.map((item, index) => (
                             <li key={index}>
                                <button
                                    className={`w-full flex items-center gap-3 p-2 rounded-full transition-colors text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 whitespace-nowrap ${isExpanded ? '' : 'justify-center'}`}
                                    title={isExpanded ? '' : item.name}
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    <span className={`transition-opacity ${isExpanded ? 'opacity-100 delay-200' : 'opacity-0 w-0'}`}>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                 </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
