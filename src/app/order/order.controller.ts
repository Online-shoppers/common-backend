import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NewOrderForm } from './dto/new-order.form';
import { OrderDTO } from './dto/order.dto';
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderService } from './order.service';
import { OrderGateway } from './orderGateway';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderGateway: OrderGateway,
  ) {}

  @ApiBody({ type: NewOrderForm })
  @Post()
  create(@Body() orderForm: NewOrderForm) {
    return this.orderService.createOrder(orderForm);
  }

  @ApiResponse({ type: OrderDTO, isArray: true })
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @ApiResponse({ type: OrderDTO })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @ApiResponse({ type: OrderDTO })
  @Put(':id')
  async update(@Param('id') orderId: string, @Body() status: OrderStatuses) {
    const updated = await this.orderService.update(orderId, status);

    this.orderGateway.server.emit('updateOrderStatus', updated);
  }

  @ApiResponse({ type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
