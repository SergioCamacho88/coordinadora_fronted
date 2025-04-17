import axios from "axios";
import { getToken } from "../utils/token";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor para agregar el token a todas las peticiones
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
