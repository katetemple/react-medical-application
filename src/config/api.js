import axios from "axios";

export default axios.create({
    baseURL: 'https://ca2-med-api.vercel.app'
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// });

// export default api;

