import axios from "axios";

const api = axios.create({
  baseURL: "https://employee-management-system-atdo.onrender.com/api",
  withCredentials: true,
});

export default api;
