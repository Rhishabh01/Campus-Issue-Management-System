import axios from "axios";
import { auth } from "./firebase";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api"
});

// Attach Firebase ID token to every request
API.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not attach auth token:", err.message);
  }
  return config;
});

// CREATE ISSUE
export const createIssue = (data) => API.post("/issues", data);

// GET ISSUES
export const getIssues = (params) => API.get("/issues", { params });

// UPDATE STATUS
export const updateStatus = (id, data) => API.put(`/issues/${id}/status`, data);

// VERIFY
export const verifyIssue = (id, data) => API.post(`/issues/${id}/verify`, data);

// NOTIFICATIONS
export const getNotifications = (userId) =>
  API.get(`/notifications/${userId}`);

export const syncUserRole = (role, token) => API.post("/users/sync", { role }, {
  headers: token ? { Authorization: `Bearer ${token}` } : {}
});

export default API;
