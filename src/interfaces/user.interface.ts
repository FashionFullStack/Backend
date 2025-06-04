export enum UserRole {
  ADMIN = 'admin',
  STORE = 'store',
  CONSUMER = 'consumer',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  profile?: {
    bodyMeasurements?: {
      height: number;
      weight: number;
      chest: number;
      waist: number;
      hips: number;
      inseam: number;
      shoulder: number;
      units: {
        height: 'cm' | 'in';
        weight: 'kg' | 'lb';
        measurements: 'cm' | 'in';
      };
    };
    avatar?: string;
    preferences?: string[];
    storeDetails?: {
      storeName: string;
      description: string;
      businessRegistrationNumber: string;
      contactEmail: string;
      contactPhone: string;
      address: string;
      openingHours: {
        [key: string]: {
          open: string;
          close: string;
        };
      };
    };
  };
  deviceTokens: string[];
  lastLogin?: Date;
  isProfileComplete: boolean;
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showProfile: boolean;
      showMeasurements: boolean;
    };
    language: string;
    currency: string;
  };
}

export interface IUser {
  _id: string;
  email: string;
  googleId?: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profile: IUserProfile;
  isProfileComplete: boolean;
  isActive: boolean;
  lastLogin?: Date;
  deviceTokens: string[];
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  bodyMeasurements?: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    inseam: number;
    shoulder: number;
  };
  avatar?: string;
  preferences: string[];
  storeDetails?: {
    storeName: string;
    businessRegistrationNumber: string;
    taxId: string;
    storeAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    contactPhone: string;
    businessEmail: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
} 