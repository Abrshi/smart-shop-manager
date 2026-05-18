// axios/axios.js
import axios from "axios";

export const axiosbaseurl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};


// Hold access token only in memoryTEST
let accessToken = null;

// Attach token to requests
axiosbaseurl.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle 401 Unauthorized (expired access token)
axiosbaseurl.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosbaseurl(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token request (refresh token is in HttpOnly cookie)
        const res = await axiosbaseurl.post("/auth/refresh");
        const newToken = res.data.accessToken;

        accessToken = newToken; // keep in memory only
        axiosbaseurl.defaults.headers.common.Authorization = "Bearer " + newToken;
        processQueue(null, newToken);

        return axiosbaseurl(originalRequest);
      } catch (err) {
        processQueue(err, null);
        accessToken = null; // clear memory
        // maybe redirect to login page
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);