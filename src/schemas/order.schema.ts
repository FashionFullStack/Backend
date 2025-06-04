import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';
import { OrderStatus } from '../interfaces/user.interface';

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: Product;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: Number, required: true })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: Object, required: true })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @Prop({ type: String })
  paymentMethod: string;

  @Prop({ type: String })
  paymentId?: string;

  @Prop({ type: String })
  trackingNumber?: string;

  @Prop({ type: Date })
  estimatedDeliveryDate?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 