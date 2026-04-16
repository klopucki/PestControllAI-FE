export type Property = {
    id: string;
    name: string;
    address: string;
    description: string;
    isDeleted: boolean;
};

export type DeviceType = 'camera' | 'microphone' | 'sensor' | 'trap';

export type DeviceEvent = {
    id: string;
    deviceId: string;
    deviceName: string;
    propertyName: string;
    timestamp: string;
    eventType: 'motion' | 'sound' | 'capture' | 'alert';
    description: string;
    imageUri?: string;
};

export type Device = {
    id: string;
    propertiesId: string;
    name: string;
    type: DeviceType;
    iconName?: string;
    imageUri?: string;
    status: 'active' | 'inactive' | 'alert';
    isListening: boolean;
    isDeleted: boolean;
    lastCaptureDate?: string;
};

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    PropertyList: undefined;
    PropertyDetail: { propertyId: string };
    PropertyForm: { property?: Property };
    DeviceForm: { propertyId: string; device?: Device };
    DeviceDetail: { device: Device };
    Notifications: undefined;
    Statistics: { propertyId?: string; deviceId?: string };
    Settings: undefined;
};
