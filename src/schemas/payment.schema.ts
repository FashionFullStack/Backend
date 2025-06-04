import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  ESEWA = 'esewa',
  QR = 'qr',
  CARD = 'card'
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'NPR' })
  currency: string;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  transactionId?: string;

  @Prop()
  qrCode?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  refundReason?: string;

  @Prop()
  errorMessage?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment); 