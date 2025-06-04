import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductCategory, ProductSubCategory } from '../interfaces/product.interface';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ required: true, enum: ProductSubCategory })
  subCategory: ProductSubCategory;

  @Prop({
    type: {
      regular: { type: Number, required: true },
      sale: Number,
      wholesale: Number,
    },
    required: true,
  })
  price: {
    regular: number;
    sale?: number;
    wholesale?: number;
  };

  @Prop({ type: [String], required: true })
  sizes: string[];

  @Prop({ type: [String], required: true })
  colors: string[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ default: false })
  virtualTryOnEnabled: boolean;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  material: string;

  @Prop({ type: [String] })
  careInstructions: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({
    type: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  })
  ratings: {
    average: number;
    count: number;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product); 