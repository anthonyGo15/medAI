import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api', // URL de tu backend
});

// Interceptor para agregar el token de autorización si está disponible
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
