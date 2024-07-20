import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const session = await getSession();
//     const sessionId = session?.user?.sessionId;

//     if (sessionId) {
//       config.headers['Session-ID'] = sessionId;
//     }

//     return config;
//   },
//   async (error) => {
//     return await Promise.reject(error);
//   }
// );

export default axiosInstance;
