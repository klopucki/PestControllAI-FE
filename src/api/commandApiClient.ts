import axios from 'axios';

const COMMAND_BASE_URL = 'http://10.0.2.2:5078/api';

const commandApiClient = axios.create({
    baseURL: COMMAND_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TODO: Add request interceptor for JWT token injection here
commandApiClient.interceptors.request.use(
    async (config) => {
        // const token = await getAuthToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`; // ??? that easy way ???
        return config;
    },
    (error) => Promise.reject(error)
);

export default commandApiClient;
