import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Card from '../keuangan/components/Card';
import api from '../../api';

const Settings = () => {
    const [kantongs, setKantongs] = useState([]);
    const [allocations, setAllocations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                setLoading(true);
                const [kantongsRes, settingsRes] = await Promise.all([
                    api.get('/kantongs'),
                    api.get('/settings')
                ]);

                setKantongs(kantongsRes.data);

                const initialAllocations = {};
                kantongsRes.data.forEach(kantong => {
                    const key = `allocation_${kantong.id}`;
                    initialAllocations[key] = settingsRes.data[key] || 0;
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
        const key = `allocation_${id}`;
        // DIUBAH: Mengganti koma dengan titik untuk konsistensi
        const sanitizedValue = value.replace(',', '.');
        
        // Memastikan hanya angka dan satu titik yang diterima
        if (/^\d*\.?\d*$/.test(sanitizedValue)) {
            setAllocations(prev => ({ ...prev, [key]: sanitizedValue }));
        }
    };

    const handleSaveChanges = async () => {
        // Mengubah semua nilai menjadi angka sebelum dikirim
        const dataToSave = Object.fromEntries(
            Object.entries(allocations).map(([key, value]) => [key, parseFloat(value) || 0])
        );

        try {
            await api.post('/settings', dataToSave);
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
                </div>
                <button 
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    <Save size={18} />
                    <span>Simpan Pengaturan</span>
                </button>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Pengaturan Kantong</h3>
                <div className="space-y-4">
                    {kantongs.map((kantong) => (
                        <div key={kantong.id} className="flex items-center justify-between">
                            <label className="font-medium text-gray-800 dark:text-gray-200">{kantong.title}</label>
                            <div className="flex items-center w-1/3 md:w-1/4">
                                <input
                                    // DIUBAH: tipe input menjadi 'text'
                                    type="text"
                                    value={allocations[`allocation_${kantong.id}`] || ''}
                                    onChange={(e) => handleAllocationChange(kantong.id, e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                                />
                                <span className="ml-2 text-lg font-medium text-gray-500">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Settings;