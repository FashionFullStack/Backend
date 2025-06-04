import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Kathmandu' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Bagmati' })
  @IsString()
  state: string;

  @ApiProperty({ example: '44600' })
  @IsString()
  zipCode: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({ example: 'eSewa' })
  @IsString()
  paymentMethod: string;
} 