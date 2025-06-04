import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { OrderStatus } from '../../interfaces/user.interface';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ example: 'ABC123XYZ' })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  estimatedDeliveryDate?: Date;

  @ApiProperty({ example: 'TX123456' })
  @IsString()
  @IsOptional()
  paymentId?: string;
} 