import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { CloudinaryResponse } from '../upload/interfaces/cloudinary-response.interface';
import { TryOnResult } from './interfaces/try-on-result.interface';
import axios from 'axios';

@Injectable()
export class VirtualTryOnService {
  constructor(private readonly uploadService: UploadService) {}

  async generateTryOn(
    productImage: { buffer: Buffer },
    userMeasurements: any,
    modelType: '2d' | '3d' = '2d',
  ): Promise<TryOnResult> {
    try {
      // 1. Upload product image to Cloudinary
      const uploadedImage = await this.uploadService.uploadImage(
        productImage,
        'virtual-tryon',
      );

      // 2. Call external 3D rendering service (replace with actual service URL)
      const apiUrl = process.env.VIRTUAL_TRYON_API_URL;
      if (!apiUrl) {
        throw new Error('Virtual try-on API URL not configured');
      }

      const renderingResult = await axios.post(
        apiUrl,
        {
          productImageUrl: uploadedImage.secure_url,
          measurements: userMeasurements,
          renderType: modelType,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.VIRTUAL_TRYON_API_KEY}`,
          },
        },
      );

      // 3. Process and return the result
      return {
        renderedImageUrl: renderingResult.data.renderedImageUrl,
        previewUrl: renderingResult.data.previewUrl,
        modelData: {
          height: userMeasurements.height,
          weight: userMeasurements.weight,
          measurements: {
            chest: userMeasurements.chest,
            waist: userMeasurements.waist,
            hips: userMeasurements.hips,
            inseam: userMeasurements.inseam,
            shoulder: userMeasurements.shoulder,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Error generating virtual try-on: ' + error.message,
      );
    }
  }

  async generateBatchTryOn(
    productImages: Array<{ buffer: Buffer }>,
    userMeasurements: any,
    modelType: '2d' | '3d' = '2d',
  ): Promise<TryOnResult[]> {
    try {
      const results = await Promise.all(
        productImages.map(image =>
          this.generateTryOn(image, userMeasurements, modelType),
        ),
      );
      return results;
    } catch (error) {
      throw new BadRequestException(
        'Error generating batch virtual try-on: ' + error.message,
      );
    }
  }

  async saveVirtualTryOn(
    userId: string,
    productId: string,
    tryOnResult: TryOnResult,
  ): Promise<void> {
    // TODO: Implement saving try-on results to database
    // This would store the results for later viewing in the user's virtual wardrobe
  }
} 