import axios from 'axios';

const api = axios.create({
    // Alamat dasar untuk semua permintaan API ke backend Laravel Anda.
    // Pastikan port 8000 sesuai dengan port server Laravel Anda.
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;