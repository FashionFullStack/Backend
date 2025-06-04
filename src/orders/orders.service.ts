import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Cart } from '../schemas/cart.schema';
import { Product } from '../schemas/product.schema';
import { OrderStatus } from '../interfaces/user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify stock availability and update product quantities
    for (const item of cart.items) {
      const product = await this.productModel.findById(item.product).exec();
      if (!product) {
        throw new NotFoundException(`Product ${item.product} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      await this.productModel
        .findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        })
        .exec();
    }

    // Create order
    const order = new this.orderModel({
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
    });

    // Clear cart after successful order creation
    await this.cartModel.findByIdAndUpdate(cart._id, {
      $set: { items: [], totalAmount: 0 },
    });

    return order.save();
  }

  async findAll(userId: string) {
    return this.orderModel
      .find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, user: userId })
      .populate('items.product')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel
      .findByIdAndUpdate(orderId, updateOrderDto, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { status },
        { new: true },
      )
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAllAdmin() {
    return this.orderModel
      .find()
      .populate('user', 'firstName lastName email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderStats() {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    return stats;
  }
} 