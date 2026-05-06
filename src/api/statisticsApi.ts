import {baseApi} from './baseApi';
import {Statistics} from '../navigation/types';

const ENDPOINT = '/Statistics';

export const statisticsApi = {
    // @deprecated
    getByPropertyId: (propertyId: string) =>
        baseApi.get<Statistics[]>(`${ENDPOINT}/property/${propertyId}`),

    getByDeviceId: (deviceId: string) =>
        baseApi.get<Statistics[]>(`${ENDPOINT}/device/${deviceId}`),

};
