import { Module } from '@nestjs/common';
import { VirtualTryOnService } from './virtual-tryon.service';
import { VirtualTryOnController } from './virtual-tryon.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [VirtualTryOnController],
  providers: [VirtualTryOnService],
  exports: [VirtualTryOnService],
})
export class VirtualTryOnModule {} 