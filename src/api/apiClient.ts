import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:5028/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TODO: Add request interceptor for JWT token injection here
apiClient.interceptors.request.use(
    async (config) => {
        // const token = await getAuthToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`; // ??? that easy way ???
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
