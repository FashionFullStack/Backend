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
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    _id: string;
  };
}

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wishlist' })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistService.create(req.user._id, createWishlistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wishlists for the current user' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.wishlistService.findAll(req.user._id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public wishlists' })
  findPublic() {
    return this.wishlistService.findPublic();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific wishlist' })
  findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.wishlistService.findOne(req.user._id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wishlist' })
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistService.update(req.user._id, id, updateWishlistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wishlist' })
  remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.wishlistService.remove(req.user._id, id);
  }

  @Post(':id/products/:productId')
  @ApiOperation({ summary: 'Add a product to wishlist' })
  addProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addProduct(req.user._id, id, productId);
  }

  @Delete(':id/products/:productId')
  @ApiOperation({ summary: 'Remove a product from wishlist' })
  removeProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeProduct(req.user._id, id, productId);
  }
} 