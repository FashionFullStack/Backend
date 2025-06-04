import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ example: 'My Summer Collection' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Collection of summer fashion items' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
} 