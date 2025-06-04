import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserProfile } from '../schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from '../interfaces/user.interface';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly uploadService: UploadService,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const createdUser = new this.userModel({
        ...createUserDto,
        profile: {
          preferences: [],
          ...(createUserDto.profile || {}),
        },
      });

      return await createdUser.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Could not create user');
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(userId);

    // If updating store details, ensure user is a store
    if (updateProfileDto.storeDetails && user.role !== UserRole.STORE) {
      throw new BadRequestException('Only store users can update store details');
    }

    // Update basic profile fields
    if (updateProfileDto.firstName) user.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName) user.lastName = updateProfileDto.lastName;
    if (updateProfileDto.phoneNumber) user.phoneNumber = updateProfileDto.phoneNumber;
    if (updateProfileDto.address) user.address = updateProfileDto.address;

    // Update profile-specific fields
    if (!user.profile) {
      user.profile = {
        bodyMeasurements: undefined,
        avatar: undefined,
        preferences: [],
        storeDetails: undefined
      };
    }

    if (updateProfileDto.bodyMeasurements) {
      user.profile.bodyMeasurements = updateProfileDto.bodyMeasurements;
    }

    if (updateProfileDto.avatar) {
      user.profile.avatar = updateProfileDto.avatar;
    }

    if (updateProfileDto.preferences) {
      user.profile.preferences = updateProfileDto.preferences;
    }

    if (updateProfileDto.storeDetails && user.role === UserRole.STORE) {
      user.profile.storeDetails = updateProfileDto.storeDetails;
    }

    if (updateProfileDto.settings) {
      user.settings = updateProfileDto.settings;
    }

    // Check if profile is complete based on role
    user.isProfileComplete = this.checkProfileCompletion(user);

    return await user.save();
  }

  async updateAvatar(userId: string, file: { buffer: Buffer }): Promise<User> {
    const user = await this.findOne(userId);
    const oldAvatarUrl = user.profile?.avatar;
    
    let oldPublicId = null;
    if (oldAvatarUrl) {
      // Extract public_id from Cloudinary URL
      const urlParts = oldAvatarUrl.split('/');
      const filenamePart = urlParts[urlParts.length - 1];
      oldPublicId = `avatars/${filenamePart.split('.')[0]}`;
    }

    const result = await this.uploadService.updateImage(file, oldPublicId);
    
    if (!user.profile) {
      user.profile = {
        bodyMeasurements: undefined,
        avatar: undefined,
        preferences: [],
        storeDetails: undefined
      };
    }
    
    user.profile.avatar = result.secure_url;
    return await user.save();
  }

  private checkProfileCompletion(user: User): boolean {
    const hasBasicInfo = !!(user.firstName && user.lastName && user.phoneNumber && user.address);

    if (user.role === UserRole.CONSUMER) {
      return hasBasicInfo && !!user.profile?.bodyMeasurements;
    }

    if (user.role === UserRole.STORE) {
      return hasBasicInfo && !!user.profile?.storeDetails;
    }

    return hasBasicInfo;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  async addDeviceToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { deviceTokens: token },
    });
  }

  async removeDeviceToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { deviceTokens: token },
    });
  }
} 