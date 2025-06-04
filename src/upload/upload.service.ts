import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../interfaces/cloudinary-response.interface';
import { Readable } from 'stream';
import * as streamifier from 'streamifier';

interface CloudinaryUploadResult extends CloudinaryResponse {
  result: string;
}

type UploadCallback = (error: Error | null, result: CloudinaryResponse) => void;

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'fashion-ecommerce'
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
          transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId) as CloudinaryUploadResult;
      return result.result === 'ok';
    } catch (error) {
      throw new BadRequestException('Error deleting image from Cloudinary');
    }
  }

  async updateImage(
    file: { buffer: Buffer },
    oldPublicId: string | null,
    folder: string = 'avatars',
  ): Promise<CloudinaryResponse> {
    if (oldPublicId) {
      await this.deleteImage(oldPublicId);
    }
    return this.uploadImage(file as Express.Multer.File);
  }
} 