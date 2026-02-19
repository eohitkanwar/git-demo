import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second timeout
});

let hideTimeout;
let isLoading = false;

// Check if we're on user management page
const isUserManagementPage = () => {
  return window.location.pathname.includes('/dashboard/users');
};

// Show loading only on user management page
const showLoading = () => {
  if (!isLoading && isUserManagementPage()) {
    isLoading = true;
    const loadingElement = document.querySelector('.global-loading-overlay');
    if (loadingElement) {
      loadingElement.classList.add('active');
    }
  }
};

// Hide loading after minimum 2-3 seconds
const hideLoading = () => {
  if (isLoading && isUserManagementPage()) {
    // Clear any existing hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Hide loading after at least 2.5 seconds total
    hideTimeout = setTimeout(() => {
      isLoading = false;
      const loadingElement = document.querySelector('.global-loading-overlay');
      if (loadingElement) {
        loadingElement.classList.remove('active');
      }
    }, 2500); // 2.5 seconds minimum
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    showLoading();
    
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

export default api;
