import axios from "axios";

const isServer = typeof window === "undefined";

const serverBaseURL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;

const clientBaseURL = process.env.NEXT_PUBLIC_API_BASE || "/";

export const http = axios.create({
  baseURL: isServer ? serverBaseURL : clientBaseURL,
  withCredentials: true,
  timeout: 10000,
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err)
);

// 响应拦截
http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("❌ API Error:", err?.response?.status, err?.response?.data);
    return Promise.reject(err?.response?.data || err);
  }
);
