import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }], default: [] })
  products: Types.ObjectId[];

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean, default: false })
  isPublic: boolean;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist); 