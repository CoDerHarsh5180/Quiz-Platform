import axios from 'axios';
import {toast} from 'react-hot-toast';
import dataURLtoFile from '../utils/URLtoFile';

// Relative base URL — Vite dev proxy forwards /api → http://localhost:5000
// so the browser sees it as same-origin and cookies are stored correctly.
const API_BASE_URL = '/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,         
  withCredentials: true,   
});

export const axiosAI = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 30000,
  withCredentials: true,
});
