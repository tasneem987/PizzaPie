import axios from "axios";

const api = axios.create({
  baseURL: "https://pizzapie-backend.onrender.com", // Deployed backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // keep false if not using cookies
});

export default api;
