import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
