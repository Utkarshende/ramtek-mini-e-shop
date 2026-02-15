import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://ramtek-bazar-backend.onrender.com/api' 
});

// This adds the token to EVERY request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {e
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;