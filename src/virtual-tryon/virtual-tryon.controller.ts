import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VirtualTryOnService } from './virtual-tryon.service';

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@ApiTags('virtual-tryon')
@Controller('virtual-tryon')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VirtualTryOnController {
  constructor(private readonly virtualTryOnService: VirtualTryOnService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate virtual try-on for a single product' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Virtual try-on generated successfully' })
  @UseInterceptors(FileInterceptor('image'))
  async generateTryOn(
    @UploadedFile() file: UploadedFileType,
    @Body('measurements') measurements: string,
    @Query('modelType') modelType: '2d' | '3d' = '2d',
  ) {
    if (!file) {
      throw new BadRequestException('No image uploaded');
    }

    if (!measurements) {
      throw new BadRequestException('No measurements provided');
    }

    const parsedMeasurements = JSON.parse(measurements);

    return this.virtualTryOnService.generateTryOn(
      file,
      parsedMeasurements,
      modelType,
    );
  }

  @Post('generate-batch')
  @ApiOperation({ summary: 'Generate virtual try-on for multiple products' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Batch virtual try-on generated successfully' })
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
  async generateBatchTryOn(
    @UploadedFiles() files: UploadedFileType[],
    @Body('measurements') measurements: string,
    @Query('modelType') modelType: '2d' | '3d' = '2d',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    if (!measurements) {
      throw new BadRequestException('No measurements provided');
    }

    const parsedMeasurements = JSON.parse(measurements);

    return this.virtualTryOnService.generateBatchTryOn(
      files,
      parsedMeasurements,
      modelType,
    );
  }
} 