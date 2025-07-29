import axios from 'axios';
import { getToken, removeToken, hasValidToken } from './tokenUtils';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase/config';

// Create axios instance with base URL and configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to handle token management
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📝 Request with auth token:', config.url);
    } else {
      console.log('📝 Request without auth token:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Counter to prevent infinite retry loops
let retryCount = 0;
const MAX_RETRIES = 1;

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Reset retry count on successful response
    retryCount = 0;
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { config, response } = error;
    
    // Handle authentication error (401)
    if (response?.status === 401) {
      console.warn('🔐 Authentication error:', response.data);
      
      // If we haven't tried to retry yet
      if (!config._retry && retryCount < MAX_RETRIES) {
        retryCount++;
        config._retry = true;
        
        // Check if token exists but may be invalid
        if (hasValidToken()) {
          // Token exists but was rejected - clear it
          removeToken();
          toast.error('Session expired. Please log in again.');
        } else {
          toast.error('Authentication required. Please log in.');
        }
        
        return Promise.reject(error);
      }
      
      // If we've already tried to retry
      removeToken();
      toast.error('Authentication failed. Please log in again.');
    }
    
    // Handle server errors
    if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 