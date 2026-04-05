import {baseApi} from './baseApi';
import {Device, DeviceEvent} from '../navigation/types';

const ENDPOINT = '/Devices';

export const deviceApi = {
    getByPropertyId: (propertyId: string) =>
        baseApi.get<Device[]>(`${ENDPOINT}/property/${propertyId}`),

    getEvents: (deviceId: string) =>
        baseApi.get<DeviceEvent[]>(`${ENDPOINT}/${deviceId}/events`),

    updateStatus: (id: string, isDeleted: boolean) =>
        baseApi.patch(`${ENDPOINT}`, {id, isDeleted}),

    updateListening: (id: string, isListening: boolean) =>
        baseApi.patch(`${ENDPOINT}/listening`, {id, isListening}),

    save: (device: Partial<Device>) => {
        if (device.id && !device.id.includes('.')) {
            return baseApi.put(`${ENDPOINT}`, device);
        }
        const {id, ...newDevice} = device;
        return baseApi.post(ENDPOINT, newDevice);
    },
};
