import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VisualizationService } from './visualization.service';
import { Request as ExpressRequest } from 'express';
import { User } from '../schemas/user.schema';

interface AuthenticatedRequest extends ExpressRequest {
  user: User;
}

interface RequestWithUser extends Request {
  user: User & {
    bodyMeasurements?: {
      height: number;
      weight: number;
      chest: number;
      waist: number;
      hips: number;
      inseam?: number;
      shoulder?: number;
    };
  };
}

// Define the complete measurements interface that the service expects
interface CompleteMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  shoulder: number;
}

@ApiTags('Visualization')
@Controller('visualization')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class VisualizationController {
  constructor(private readonly visualizationService: VisualizationService) {}

  private validateAndCompleteBodyMeasurements(bodyMeasurements: any): CompleteMeasurements {
    if (!bodyMeasurements) {
      throw new BadRequestException('Body measurements not found. Please update your profile.');
    }

    const requiredFields = ['height', 'weight', 'chest', 'waist', 'hips', 'inseam', 'shoulder'];
    const missingFields = requiredFields.filter(field => 
      bodyMeasurements[field] === undefined || bodyMeasurements[field] === null
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required body measurements: ${missingFields.join(', ')}. Please complete your profile.`
      );
    }

    // Validate that all measurements are positive numbers
    for (const field of requiredFields) {
      const value = bodyMeasurements[field];
      if (typeof value !== 'number' || value <= 0) {
        throw new BadRequestException(
          `Invalid ${field} measurement. Must be a positive number.`
        );
      }
    }

    return {
      height: bodyMeasurements.height,
      weight: bodyMeasurements.weight,
      chest: bodyMeasurements.chest,
      waist: bodyMeasurements.waist,
      hips: bodyMeasurements.hips,
      inseam: bodyMeasurements.inseam,
      shoulder: bodyMeasurements.shoulder,
    };
  }

  @Post('try-on')
  @ApiOperation({ summary: 'Generate virtual try-on visualization' })
  async generateVirtualTryOn(
    @Request() req: AuthenticatedRequest,
    @Body('productImageUrl') productImageUrl: string,
  ) {
    const validatedMeasurements = this.validateAndCompleteBodyMeasurements(
      req.user.bodyMeasurements
    );

    return this.visualizationService.generateVirtualTryOn(
      productImageUrl,
      validatedMeasurements,
    );
  }

  @Post('size-recommendation')
  @ApiOperation({ summary: 'Get size recommendation' })
  async getSizeRecommendation(
    @Request() req: AuthenticatedRequest,
    @Body('productId') productId: string,
  ) {
    const validatedMeasurements = this.validateAndCompleteBodyMeasurements(
      req.user.bodyMeasurements
    );

    return this.visualizationService.getSizeRecommendation(
      productId,
      validatedMeasurements,
    );
  }

  @Get('try-on/2d')
  @ApiOperation({ summary: 'Get 2D virtual try-on visualization' })
  async get2DTryOn(@Req() req: RequestWithUser) {
    const validatedMeasurements = this.validateAndCompleteBodyMeasurements(
      req.user.bodyMeasurements
    );

    return this.visualizationService.generate2DTryOn(
      validatedMeasurements
    );
  }

  @Get('try-on/3d')
  @ApiOperation({ summary: 'Get 3D virtual try-on visualization' })
  async get3DTryOn(@Req() req: RequestWithUser) {
    const validatedMeasurements = this.validateAndCompleteBodyMeasurements(
      req.user.bodyMeasurements
    );

    return this.visualizationService.generate3DTryOn(
      validatedMeasurements
    );
  }
}