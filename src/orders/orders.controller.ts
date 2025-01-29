import { Controller, UseGuards, Post, Delete, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('STAFF', 'ADMIN')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }
} 