import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory, ProductSubCategory } from '../../interfaces/product.interface';

class PriceDto {
  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  regular: number;

  @ApiProperty({ example: 2000, required: false })
  @IsNumber()
  @Min(0)
  sale?: number;

  @ApiProperty({ example: 1800, required: false })
  @IsNumber()
  @Min(0)
  wholesale?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Cotton Shirt' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A comfortable cotton shirt perfect for daily wear' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ enum: ProductSubCategory })
  @IsEnum(ProductSubCategory)
  subCategory: ProductSubCategory;

  @ApiProperty({
    example: {
      regular: 2500,
      sale: 2000,
      wholesale: 1800,
    },
  })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @ApiProperty({ example: ['S', 'M', 'L', 'XL'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty({ example: ['White', 'Blue', 'Black'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  colors: string[];

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  virtualTryOnEnabled: boolean;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 'ABC Textiles' })
  @IsString()
  manufacturer: string;

  @ApiProperty({ example: '100% Cotton' })
  @IsString()
  material: string;

  @ApiProperty({ example: ['Machine wash cold', 'Do not bleach'] })
  @IsArray()
  @IsString({ each: true })
  careInstructions: string[];

  @ApiProperty({ example: ['casual', 'cotton', 'summer'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
} 
 