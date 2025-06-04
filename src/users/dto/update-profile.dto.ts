import { IsString, IsOptional, IsObject, IsEnum, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../interfaces/user.interface';

export class BodyMeasurementsDto {
  @IsOptional()
  @IsString()
  height: number;

  @IsOptional()
  @IsString()
  weight: number;

  @IsOptional()
  @IsString()
  chest: number;

  @IsOptional()
  @IsString()
  waist: number;

  @IsOptional()
  @IsString()
  hips: number;

  @IsOptional()
  @IsString()
  inseam: number;

  @IsOptional()
  @IsString()
  shoulder: number;
}

export class StoreAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  country: string;
}

export class SocialMediaDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  twitter?: string;
}

export class StoreDetailsDto {
  @IsString()
  storeName: string;

  @IsString()
  businessRegistrationNumber: string;

  @IsString()
  taxId: string;

  @ValidateNested()
  @Type(() => StoreAddressDto)
  storeAddress: StoreAddressDto;

  @IsString()
  contactPhone: string;

  @IsString()
  businessEmail: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @IsOptional()
  @ValidateNested()
  @Type(() => BodyMeasurementsDto)
  bodyMeasurements?: BodyMeasurementsDto;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsObject()
  preferences?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StoreDetailsDto)
  storeDetails?: StoreDetailsDto;

  @IsOptional()
  @IsObject()
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