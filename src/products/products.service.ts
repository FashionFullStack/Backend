import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UserRole } from '../interfaces/user.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(role: UserRole = UserRole.CONSUMER) {
    const products = await this.productModel.find().exec();
    return products.map(product => {
      const productObj = product.toObject();
      // Only show wholesale prices to store users
      if (role !== UserRole.STORE) {
        delete productObj.price.wholesale;
      }
      return productObj;
    });
  }

  async findOne(id: string, role: UserRole = UserRole.CONSUMER) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const productObj = product.toObject();
    if (role !== UserRole.STORE) {
      delete productObj.price.wholesale;
    }
    return productObj;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async searchProducts(query: string) {
    return this.productModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .exec();
  }

  async getProductsByCategory(category: string) {
    return this.productModel.find({ category }).exec();
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.stockQuantity + quantity < 0) {
      throw new Error('Insufficient stock');
    }

    product.stockQuantity += quantity;
    return product.save();
  }
} 