import commandClient from './commandApiClient.ts';
import queryClient from './queryApiClient.ts';

export const baseApi = {
    get: async <T>(url: string) => {
        const response = await queryClient.get<T>(url);
        return response.data;
    },

    post: async <T>(url: string, data: any) => {
        const response = await commandClient.post<T>(url, data);
        return response.data;
    },

    put: async <T>(url: string, data: any) => {
        const response = await commandClient.put<T>(url, data);
        return response.data;
    },

    patch: async <T>(url: string, data: any) => {
        const response = await commandClient.patch<T>(url, data);
        return response.data;
    },

    delete: async <T>(url: string) => {
        const response = await commandClient.delete<T>(url);
        return response.data;
    },
};
