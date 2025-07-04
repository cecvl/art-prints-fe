// src/lib/api.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signUp: (email: string, password: string) =>
    api.post("/signup", { email, password }),

  signIn: (email: string, password: string) =>
    api.post("/signin", { email, password }),
};

export const artworkAPI = {
  uploadArt: (formData: FormData) =>
    api.post("/artworks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
};

export const orderAPI = {
  createOrder: (orderData: any) => api.post("/orders", orderData),
};

export default api;
