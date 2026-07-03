import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // NestJS backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
