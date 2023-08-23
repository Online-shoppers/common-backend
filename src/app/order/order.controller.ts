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

import { EditOrderForm } from './dto/edit-order.form';
import { NewOrderForm } from './dto/new-order.form';
import { OrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  update(@Param('id') id: string, @Body() orderForm: EditOrderForm) {
    return this.orderService.update(id, orderForm);
  }

  @ApiResponse({ type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
