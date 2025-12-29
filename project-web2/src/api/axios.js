import axios from "axios";

const api = axios.create({
  baseURL: "https://pizzapie-backend.onrender.com", // updated backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // true later if you use cookies
});

export default api;

