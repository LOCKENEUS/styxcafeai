// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;

// const API = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true, // Enables cookies for refresh token
// });

// // Add Authorization Header
// API.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("authToken");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// // Refresh Token Interceptor
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Request new access token using refresh token
//         const res = await axios.get(`${BASE_URL}/auth/refresh-token`, {
//           withCredentials: true, // Ensures cookies are sent
//         });

//         sessionStorage.setItem("authToken", res.data.accessToken);
//         API.defaults.headers["Authorization"] = `Bearer ${res.data.accessToken}`;

//         return API(originalRequest); // Retry the failed request
//       } catch (refreshError) {
//         console.error("Refresh token expired. Redirecting to login.");
//         sessionStorage.removeItem("authToken");
//         sessionStorage.removeItem("userRole");
//         sessionStorage.removeItem("user");

//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;

















// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;

// const API = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true, // Enables cookies for refresh token
// });

// // Store token in memory instead of sessionStorage
// let accessToken = null;

// // Function to get a new access token using the refresh token
// const refreshAccessToken = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/user/refresh-token`, {
//       withCredentials: true, // Ensures the cookie is sent
//     });

//     if (res.data.accessToken) {
//     //   accessToken = res.accessToken; // Store in memory

//     const { accessToken, user } = res.data;

//     // Store data in sessionStorage
//     sessionStorage.setItem("authToken", accessToken);
//     sessionStorage.setItem("userRole", user.role);
//     sessionStorage.setItem("user", JSON.stringify(user)); // Store user as a string

//       API.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
//       return accessToken;
//     }
//   } catch (error) {
//     console.error("Session expired. Redirecting to login.");
//     accessToken = null;
//     window.location.href = "/user/login";
//     return null;
//   }
// };

// // Add Authorization Header
// API.interceptors.request.use((config) => {
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// // Refresh Token Interceptor
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const newToken = await refreshAccessToken();
//       if (newToken) {
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         return API(originalRequest); // Retry the failed request
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // Call refresh token on app load
// const initializeAuth = async () => {
//   await refreshAccessToken(); // Try to get a new access token before user interacts
// };

// initializeAuth();

// export default API;
















import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enables cookies for refresh token
});

// Store token in memory
let accessToken = null;
let isRefreshing = false; // Prevent multiple refresh calls
let refreshSubscribers = [];

// Function to update the access token and retry failed requests
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Function to get a new access token using the refresh token
const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await axios.get(`${BASE_URL}/user/refresh-token`, {
      withCredentials: true, // Ensures cookies are sent
    });

    if (res.data.accessToken && res.data.user) {
      const { accessToken: newToken, user } = res.data;

      // Store token in sessionStorage
      sessionStorage.setItem("authToken", newToken);
      sessionStorage.setItem("userRole", user.role);
      sessionStorage.setItem("user", JSON.stringify(user));

      accessToken = newToken;
      API.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

      onTokenRefreshed(accessToken);
      return accessToken;
    }
  } catch (error) {
    console.error("Session expired. Redirecting to login.");
    sessionStorage.clear();
    window.location.href = "/user/login";
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Add Authorization Header
API.interceptors.request.use((config) => {
  const storedToken = sessionStorage.getItem("authToken");

  if (storedToken) {
    config.headers["Authorization"] = `Bearer ${storedToken}`;
  }
  return config;
});

// Refresh Token Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return API(originalRequest); // Retry the failed request
        }
      } catch (refreshError) {
        console.error("Failed to refresh token.");
      }
    }

    return Promise.reject(error);
  }
);

// Call refresh token on app load
const initializeAuth = async () => {
  await refreshAccessToken(); // Try to get a new access token
};

initializeAuth();

export default API;
