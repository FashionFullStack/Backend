import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('qr')
  @ApiOperation({ summary: 'Generate QR code for payment' })
  @ApiResponse({ status: 201, description: 'QR code generated successfully' })
  async generateQRCode(
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('currency') currency: string = 'NPR',
  ) {
    const paymentData = {
      orderId,
      amount,
      currency,
      timestamp: Date.now(),
      merchantId: process.env.MERCHANT_ID,
    };

    const qrData = JSON.stringify(paymentData);
    return this.paymentsService.generateQRCode(qrData);
  }

  @Post('esewa/initiate')
  @ApiOperation({ summary: 'Initiate eSewa payment' })
  @ApiResponse({ status: 201, description: 'eSewa payment initiated successfully' })
  async initiateEsewaPayment(
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('currency') currency: string = 'NPR',
  ) {
    return this.paymentsService.initiateEsewaPayment(orderId, amount, currency);
  }

  @Get('verify/:orderId')
  @ApiOperation({ summary: 'Verify payment status' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(
    @Param('orderId') orderId: string,
    @Query('transactionId') transactionId: string,
    @Query('paymentMethod') paymentMethod: 'esewa' | 'qr',
  ) {
    return this.paymentsService.verifyPayment(
      orderId,
      transactionId,
      paymentMethod,
    );
  }

  @Post('refund')
  @ApiOperation({ summary: 'Process refund' })
  @ApiResponse({ status: 201, description: 'Refund processed successfully' })
  async processRefund(
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
  ) {
    return this.paymentsService.processRefund(orderId, amount, reason);
  }
} 