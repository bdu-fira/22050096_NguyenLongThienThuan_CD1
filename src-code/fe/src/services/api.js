import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',// baseURL: ,
  // baseURL: 'http://localhost:4000/',// baseURL: ,
});
const getToken=()=>{
  return JSON.parse(sessionStorage.getItem("auth"))?.token??"";
}
// Intercept requests to add the Authorization header
axiosInstance.interceptors.request.use(
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

// Intercept responses to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error responses here (e.g., redirect to login on 401)
    return Promise.reject(error);
  }
);

export default axiosInstance;