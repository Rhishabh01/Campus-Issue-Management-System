import axios from "axios";
import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "https://campus-issue-management-system.onrender.com";

console.log("🔗 API Base URL:", API_URL);

const API = axios.create({
  baseURL: `${API_URL}/api`
});

// Token caching
let cachedToken = null;
let tokenExpiry = null;

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  
  try {
    const result = await user.getIdTokenResult();
    cachedToken = result.token;
    // Expire 5 minutes before actual expiry
    const expirationTime = new Date(result.expirationTime).getTime();
    tokenExpiry = expirationTime - 5 * 60 * 1000;
    return cachedToken;
  } catch (err) {
    console.warn("Failed to get ID token:", err);
    return null;
  }
};

// Request Interceptor: Attach token
API.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic and GET Cache
const getCache = new Map();

API.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get') {
      getCache.set(response.config.url, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    // Clear relevant cache on mutating requests
    if (['post', 'put', 'delete', 'patch'].includes(response.config.method)) {
      getCache.clear(); // Simple strategy: clear all cache on mutations
    }
    return response;
  },
  async (err) => {
    const config = err.config;
    // SWR fallback for GET requests if network fails
    if (config && config.method === 'get' && err.message === 'Network Error') {
      const cached = getCache.get(config.url);
      if (cached) {
        console.warn(`Serving ${config.url} from cache due to network error.`);
        return { data: cached.data, status: 200, statusText: 'OK', headers: {}, config, isCached: true };
      }
    }

    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    // Retry up to 3 times for network errors or 5xx
    if (config.retry < 3 && (err.message === 'Network Error' || (err.response && err.response.status >= 500))) {
      config.retry += 1;
      const delay = Math.pow(2, config.retry) * 1000; // 2s, 4s, 8s
      console.log(`Retrying request ${config.url} in ${delay}ms... (Attempt ${config.retry})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return API(config);
    }
    return Promise.reject(err);
  }
);

// Custom GET with Stale-While-Revalidate
const swrGet = async (url, config = {}) => {
  const cached = getCache.get(url);
  const TTL = 60000; // 1 minute TTL for fresh data

  if (cached && (Date.now() - cached.timestamp < TTL)) {
    // Serve fresh cache
    return { data: cached.data };
  } else if (cached) {
    // Serve stale cache immediately, but revalidate in background
    API.get(url, config).catch(console.warn);
    return { data: cached.data };
  }

  // No cache, fetch directly
  return API.get(url, config);
};

// CREATE ISSUE
export const createIssue = (data) => API.post("/issues", data);

// GET ISSUES
export const getIssues = (params) => {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  return swrGet(`/issues${queryString}`);
};

// UPDATE STATUS
export const updateStatus = (id, data) => API.put(`/issues/${id}/status`, data);

// VERIFY
export const verifyIssue = (id, data) => API.post(`/issues/${id}/verify`, data);

// NOTIFICATIONS
export const getNotifications = (userId) => swrGet(`/notifications/${userId}`);

export const syncUserRole = (role, token) => API.post("/users/sync", { role }, {
  headers: token ? { Authorization: `Bearer ${token}` } : {}
});

export default API;
