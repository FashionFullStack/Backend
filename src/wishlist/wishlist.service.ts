import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist } from '../schemas/wishlist.schema';
import { Product } from '../schemas/product.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(userId: string, createWishlistDto: CreateWishlistDto) {
    const wishlist = new this.wishlistModel({
      user: userId,
      ...createWishlistDto,
    });
    return wishlist.save();
  }

  async findAll(userId: string) {
    return this.wishlistModel
      .find({ user: userId })
      .populate('products')
      .exec();
  }

  async findOne(userId: string, wishlistId: string) {
    const wishlist = await this.wishlistModel
      .findOne({ _id: wishlistId, user: userId })
      .populate('products')
      .exec();

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async update(userId: string, wishlistId: string, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistModel
      .findOneAndUpdate(
        { _id: wishlistId, user: userId },
        updateWishlistDto,
        { new: true },
      )
      .exec();

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async remove(userId: string, wishlistId: string) {
    const result = await this.wishlistModel
      .deleteOne({ _id: wishlistId, user: userId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Wishlist not found');
    }
  }

  async addProduct(userId: string, wishlistId: string, productId: string) {
    const [wishlist, product] = await Promise.all([
      this.wishlistModel.findOne({ _id: wishlistId, user: userId }).exec(),
      this.productModel.findById(productId).exec(),
    ]);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productObjectId = new Types.ObjectId(productId);
    if (wishlist.products.some(p => p.toString() === productId)) {
      throw new BadRequestException('Product already in wishlist');
    }

    wishlist.products = [...wishlist.products, productObjectId];
    return wishlist.save();
  }

  async removeProduct(userId: string, wishlistId: string, productId: string) {
    const wishlist = await this.wishlistModel
      .findOne({ _id: wishlistId, user: userId })
      .exec();

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    );

    return wishlist.save();
  }

  async findPublic() {
    return this.wishlistModel
      .find({ isPublic: true })
      .populate('user', 'firstName lastName')
      .populate('products')
      .exec();
  }
} 