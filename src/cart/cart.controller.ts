import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    _id: string;
  };
}

@ApiTags('Cart')
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user._id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@Request() req: AuthenticatedRequest, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(
      req.user._id,
      addToCartDto.productId,
      addToCartDto.quantity,
      addToCartDto.size,
      addToCartDto.color,
    );
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeFromCart(@Request() req: AuthenticatedRequest, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user._id, itemId);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateCartItemQuantity(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItemQuantity(
      req.user._id,
      itemId,
      updateCartItemDto.quantity,
    );
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user._id);
  }
} 