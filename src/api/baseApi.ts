import apiClient from './apiClient';

export const baseApi = {
    get: async <T>(url: string) => {
        const response = await apiClient.get<T>(url);
        return response.data;
    },

    post: async <T>(url: string, data: any) => {
        const response = await apiClient.post<T>(url, data);
        return response.data;
    },

    put: async <T>(url: string, data: any) => {
        const response = await apiClient.put<T>(url, data);
        return response.data;
    },

    patch: async <T>(url: string, data: any) => {
        const response = await apiClient.patch<T>(url, data);
        return response.data;
    },

    delete: async <T>(url: string) => {
        const response = await apiClient.delete<T>(url);
        return response.data;
    },
};
