import axios from 'axios';

const Query_BASE_URL = 'http://10.0.2.2:5284/api';

const queryApiClient = axios.create({
    baseURL: Query_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TODO: Add request interceptor for JWT token injection here
queryApiClient.interceptors.request.use(
    async (config) => {
        // const token = await getAuthToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`; // ??? that easy way ???
        return config;
    },
    (error) => Promise.reject(error)
);

export default queryApiClient;
