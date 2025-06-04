import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../schemas/payment.schema';
import * as QRCode from 'qrcode';
import axios from 'axios';
import * as crypto from 'crypto';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: 'esewa' | 'qr' | 'cod';
  status: PaymentStatus;
  transactionId?: string;
  qrCode?: string;
  paymentUrl?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>
  ) {}

  private generateSignature(data: Record<string, any>, secretKey: string): string {
    const sortedKeys = Object.keys(data).sort();
    const signatureString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    return crypto
      .createHmac('sha256', secretKey)
      .update(signatureString)
      .digest('hex');
  }

  async generateQRCode(qrData: string): Promise<string> {
    try {
      return await QRCode.toDataURL(qrData);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  async initiateEsewaPayment(
    orderId: string,
    amount: number,
    currency: string = 'NPR',
  ): Promise<PaymentDetails> {
    try {
      const paymentData = {
        amt: amount,
        pdc: 0, // Platform development charge
        psc: 0, // Service charge
        txAmt: 0, // Tax amount
        tAmt: amount, // Total amount
        pid: orderId,
        scd: process.env.ESEWA_MERCHANT_ID,
        su: `${process.env.FRONTEND_URL}/payment/success`,
        fu: `${process.env.FRONTEND_URL}/payment/failure`,
      };

      // In production, this would be the actual eSewa API endpoint
      const paymentUrl = `${process.env.ESEWA_API_URL}/epay/main`;

      return {
        orderId,
        amount,
        currency,
        paymentMethod: 'esewa',
        status: PaymentStatus.PENDING,
        paymentUrl,
        metadata: paymentData,
      };
    } catch (error) {
      throw new BadRequestException('Error initiating eSewa payment');
    }
  }

  async verifyPayment(
    orderId: string,
    transactionId: string,
    paymentMethod: 'esewa' | 'qr',
  ): Promise<PaymentDetails> {
    try {
      if (paymentMethod === 'esewa') {
        const verificationData = {
          amt: 100,
          rid: transactionId,
          pid: orderId,
          scd: process.env.ESEWA_MERCHANT_ID,
        };

        const response = await axios.get(
          `${process.env.ESEWA_API_URL}/epay/transrec`,
          { params: verificationData },
        );

        if (response.data.includes('Success')) {
          return {
            orderId,
            amount: 100,
            currency: 'NPR',
            paymentMethod: 'esewa',
            status: PaymentStatus.COMPLETED,
            transactionId,
          };
        }
      } else if (paymentMethod === 'qr') {
        // Implement QR payment verification logic
        // This would typically involve checking against your backend records
        // and possibly verifying with a payment gateway
      }

      throw new BadRequestException('Payment verification failed');
    } catch (error) {
      throw new BadRequestException('Error verifying payment');
    }
  }

  async processRefund(
    orderId: string,
    amount: number,
    reason: string,
  ): Promise<PaymentDetails> {
    try {
      // Implement refund logic here
      // This would typically involve calling payment gateway's refund API
      return {
        orderId,
        amount,
        currency: 'NPR',
        paymentMethod: 'esewa', // or 'qr'
        status: PaymentStatus.REFUNDED,
        metadata: { reason },
      };
    } catch (error) {
      throw new BadRequestException('Error processing refund');
    }
  }
} 