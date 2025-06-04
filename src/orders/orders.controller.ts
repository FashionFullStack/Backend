import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, OrderStatus } from '../interfaces/user.interface';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    _id: string;
    role: UserRole;
  };
}

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user._id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.ordersService.findAll(req.user._id);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order' })
  findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.ordersService.findOne(req.user._id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
} 