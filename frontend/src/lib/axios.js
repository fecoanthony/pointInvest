// src/lib/axios.js (unchanged)
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE + "/api", // => http://localhost:5000/api
  withCredentials: true,
});

export default axiosInstance;
