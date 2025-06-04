import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
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
    };
  };
}

@ApiTags('Visualization')
@Controller('visualization')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class VisualizationController {
  constructor(private readonly visualizationService: VisualizationService) {}

  @Post('try-on')
  @ApiOperation({ summary: 'Generate virtual try-on visualization' })
  async generateVirtualTryOn(
    @Request() req: AuthenticatedRequest,
    @Body('productImageUrl') productImageUrl: string,
  ) {
    if (!req.user.bodyMeasurements) {
      throw new Error('Body measurements not found. Please update your profile.');
    }

    return this.visualizationService.generateVirtualTryOn(
      productImageUrl,
      req.user.bodyMeasurements,
    );
  }

  @Post('size-recommendation')
  @ApiOperation({ summary: 'Get size recommendation' })
  async getSizeRecommendation(
    @Request() req: AuthenticatedRequest,
    @Body('productId') productId: string,
  ) {
    if (!req.user.bodyMeasurements) {
      throw new Error('Body measurements not found. Please update your profile.');
    }

    return this.visualizationService.getSizeRecommendation(
      productId,
      req.user.bodyMeasurements,
    );
  }

  @Get('try-on/2d')
  @ApiOperation({ summary: 'Get 2D virtual try-on visualization' })
  async get2DTryOn(@Req() req: RequestWithUser) {
    if (!req.user.bodyMeasurements) {
      throw new Error('Body measurements are required for visualization');
    }

    return this.visualizationService.generate2DTryOn(
      req.user.bodyMeasurements
    );
  }

  @Get('try-on/3d')
  @ApiOperation({ summary: 'Get 3D virtual try-on visualization' })
  async get3DTryOn(@Req() req: RequestWithUser) {
    if (!req.user.bodyMeasurements) {
      throw new Error('Body measurements are required for visualization');
    }

    return this.visualizationService.generate3DTryOn(
      req.user.bodyMeasurements
    );
  }
} 