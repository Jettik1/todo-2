import axios, { AxiosRequestConfig } from "axios";
import { store } from "@/store/store";
import { logout, updateToken } from "@/store/authSlice";
import { authAPI } from "./authAPI";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  }, //?
});

interface AxiosRetryRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Unknown error in client.ts 21"
      );
    }

    const originalRequest = error.config as AxiosRetryRequest;

    if (error.response?.status == 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      try {
        const refreshToken = store.getState().auth.refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const { accessToken } = await authAPI.refreshTokens(refreshToken);

        store.dispatch(updateToken({ accessToken }));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRetryRequest;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        if (!refreshToken) {
          throw new Error("no refresh token");
        }
        const { accessToken } = await authAPI.refreshTokens(refreshToken);
        store.dispatch(updateToken({ accessToken }));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
