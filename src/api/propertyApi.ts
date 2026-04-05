import {baseApi} from './baseApi';
import {Property} from '../navigation/types';

const ENDPOINT = '/Properties';

export const propertyApi = {
    getAll: () => baseApi.get<Property[]>(ENDPOINT),

    getById: (id: string) => baseApi.get<Property>(`${ENDPOINT}/${id}`),

    updateStatus: (Id: string, IsDeleted: boolean) =>
        baseApi.patch(ENDPOINT, {Id, IsDeleted}),

    save: (property: Partial<Property>) => {
        if (property.id && !property.id.includes('.')) {
            return baseApi.put(ENDPOINT, property);
        }
        const {id, ...newProperty} = property;
        return baseApi.post(ENDPOINT, newProperty);
    },
};
