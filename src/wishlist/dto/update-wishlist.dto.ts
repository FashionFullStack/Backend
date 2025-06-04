import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWishlistDto {
  @ApiProperty({ example: 'My Updated Collection' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated collection description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
} 