import React, { useState, useEffect } from 'react';
import { Save, ArrowUp, ArrowDown, Grab } from 'lucide-react';
import Card from '../keuangan/components/Card';
import api from '../../api';
import { formatCurrency } from '../keuangan/data';

const Settings = () => {
    const [operationalKantongs, setOperationalKantongs] = useState([]);
    const [allocations, setAllocations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                setLoading(true);
                const [kantongsRes, investorsRes, settingsRes] = await Promise.all([
                    api.get('/kantongs'),
                    api.get('/investors'),
                    api.get('/settings')
                ]);

                const investorNames = new Set(investorsRes.data.map(inv => inv.name));
                const filteredKantongs = kantongsRes.data
                    .filter(k => k.is_deletable && !investorNames.has(k.title))
                    .sort((a, b) => a.priority - b.priority); // Mengurutkan berdasarkan prioritas
                
                setOperationalKantongs(filteredKantongs);

                const initialAllocations = {};
                filteredKantongs.forEach(kantong => {
                    const key = `allocation_volume_${kantong.id}`;
                    initialAllocations[kantong.id] = settingsRes.data[key] || '0';
                });
                setAllocations(initialAllocations);
                
                setError(null);
            } catch (err) {
                setError("Gagal mengambil data pengaturan.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettingsData();
    }, []);

    const handleAllocationChange = (id, value) => {
        const sanitizedValue = value.replace(/[^0-9]/g, ''); // Hanya terima angka
        setAllocations(prev => ({ ...prev, [id]: sanitizedValue }));
    };
    
    const handleMove = (index, direction) => {
        const newOrder = [...operationalKantongs];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;
        
        // Tukar posisi
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        
        setOperationalKantongs(newOrder);
    };

    const handleSaveChanges = async () => {
        const dataToSave = operationalKantongs.map(k => ({
            id: k.id,
            volume: parseFloat(allocations[k.id] || 0)
        }));

        try {
            // Mengirim data alokasi dan urutan prioritas ke backend
            await api.post('/settings', { allocations: dataToSave });
            alert('Pengaturan berhasil disimpan!');
        } catch (err) {
            alert('Gagal menyimpan pengaturan.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-10">Memuat pengaturan...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Atur target volume dan prioritas dana untuk setiap kantong.</p>
                </div>
                <button onClick={handleSaveChanges} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
                    <Save size={18} />
                    <span>Simpan Pengaturan</span>
                </button>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Alokasi Dana Kantong</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Urutkan kantong berdasarkan prioritas pengisian. "Gaji Karyawan" akan selalu menjadi yang utama.</p>
                <div className="space-y-3">
                    {operationalKantongs.map((kantong, index) => (
                        <div key={kantong.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <button onClick={() => handleMove(index, -1)} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"><ArrowUp size={16} /></button>
                                    <button onClick={() => handleMove(index, 1)} disabled={index === operationalKantongs.length - 1} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"><ArrowDown size={16} /></button>
                                </div>
                                <label className="font-medium text-gray-800 dark:text-gray-200">{kantong.title}</label>
                            </div>
                            <div className="flex items-center w-2/5 md:w-1/3">
                                <span className="mr-2 text-lg font-medium text-gray-500">Rp</span>
                                <input
                                    type="text"
                                    value={formatCurrency(parseFloat(allocations[kantong.id] || 0)).replace('Rp', '').trim()}
                                    onChange={(e) => handleAllocationChange(kantong.id, e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Settings;
