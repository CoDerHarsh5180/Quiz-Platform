import axios from 'axios';
import {toast} from 'react-hot-toast';
import dataURLtoFile from '../utils/URLtoFile';
const API_BASE_URL = `${import.meta.env.VITE_APP_URL}/api/v1`; 

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const axiosAI = axios.create({
    baseURL: API_BASE_URL
})

