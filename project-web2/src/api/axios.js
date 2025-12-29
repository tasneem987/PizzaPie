import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // true later if you use cookies
});

export default api;
