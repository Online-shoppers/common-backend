import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
    return this.orderService.create(orderForm);
  }

  @ApiResponse({ type: OrderDTO, isArray: true })
  @Get()
  async findAll() {
    return this.orderService.findAll().then(data => {
      console.log(data);
      return data;
    });
  }

  @ApiResponse({ type: OrderDTO })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @ApiResponse({ type: OrderDTO })
  @Patch(':id')
  update(@Param('id') id: string, @Body() orderForm: EditOrderForm) {
    return this.orderService.update(id, orderForm);
  }

  @ApiResponse({ type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
