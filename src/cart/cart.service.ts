import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Cart, CartItem } from '../schemas/cart.schema';
import { Product } from '../schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();

    if (!cart) {
      return this.createCart(userId);
    }

    return cart;
  }

  private async createCart(userId: string) {
    const cart = new this.cartModel({
      user: userId,
      items: [],
      totalAmount: 0,
    });
    return cart.save();
  }

  async addToCart(userId: string, productId: string, quantity: number, size: string, color: string) {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    let cart = await this.getCart(userId);

    const existingItemIndex = cart.items.findIndex(
      (item) => {
        const productId = (item.product instanceof Types.ObjectId) 
          ? item.product.toString() 
          : (item.product as any)._id.toString();
        return productId === productId && item.size === size && item.color === color;
      }
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const mongooseDoc = product as Document;
      cart.items.push({
        product: mongooseDoc._id,
        quantity,
        size,
        color,
        price: product.price.regular,
      } as CartItem);
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return cart.save();
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(item => {
      const cartItem = item as unknown as { _id?: Types.ObjectId };
      return cartItem._id?.toString() !== itemId;
    });
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return cart.save();
  }

  async updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const cart = await this.getCart(userId);
    const item = cart.items.find(item => {
      const cartItem = item as unknown as { _id?: Types.ObjectId };
      return cartItem._id?.toString() === itemId;
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const productRef = item.product as unknown as Product;
    const product = await this.productModel.findById(productRef._id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return cart.save();
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.totalAmount = 0;
    return cart.save();
  }
} 