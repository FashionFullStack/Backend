import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FashionAssistantService } from './fashion-assistant.service';

@ApiTags('fashion-assistant')
@Controller('fashion-assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FashionAssistantController {
  constructor(private readonly fashionAssistantService: FashionAssistantService) {}

  @Post('recommendations')
  @ApiOperation({ summary: 'Get personalized fashion recommendations' })
  @ApiResponse({
    status: 201,
    description: 'Fashion recommendations generated successfully',
  })
  async getRecommendations(
    @Body('userId') userId: string,
    @Body('preferences') preferences: any,
  ) {
    return this.fashionAssistantService.getPersonalizedRecommendations(
      userId,
      preferences,
    );
  }

  @Get('style-analysis')
  @ApiOperation({ summary: 'Analyze outfit style' })
  @ApiResponse({ status: 200, description: 'Style analysis completed successfully' })
  async analyzeStyle(@Query('imageUrl') imageUrl: string) {
    return this.fashionAssistantService.getStyleAnalysis(imageUrl);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get fashion trend predictions' })
  @ApiResponse({
    status: 200,
    description: 'Fashion trends retrieved successfully',
  })
  async getTrends() {
    return this.fashionAssistantService.getTrendPredictions();
  }
} 