import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../interfaces/user.interface';
import { BodyMeasurements } from '../interfaces/body-measurements.interface';

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ type: Object })
  bodyMeasurements?: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    inseam: number;
    shoulder: number;
  };

  @Prop({ type: String })
  avatar?: string;

  @Prop({ type: [String], default: [] })
  preferences: string[];

  @Prop({ type: Object })
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

const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  googleId?: string;

  @Prop()
  password?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.CONSUMER })
  role: UserRole;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: Object })
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ type: Object })
  bodyMeasurements?: BodyMeasurements;

  @Prop({ type: UserProfileSchema })
  profile: UserProfile;

  @Prop({ type: Boolean, default: false })
  isProfileComplete: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop({ type: [String], default: [] })
  deviceTokens: string[];

  @Prop({ type: Object })
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    currency: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User); 