import { Module } from '@nestjs/common';
import { FashionAssistantService } from './fashion-assistant.service';
import { FashionAssistantController } from './fashion-assistant.controller';

@Module({
  controllers: [FashionAssistantController],
  providers: [FashionAssistantService],
  exports: [FashionAssistantService],
})
export class FashionAssistantModule {} 