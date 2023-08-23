import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CartProductDto } from '../cart-product/dto/cart-product.dto';
import { NewOrderForm } from '../order/dto/new-order.form';
import { OrderProductService } from './order-product.service';

@ApiTags('Order-item')
@Controller('order-item')
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) {}

  @Get()
  getOrderProducts(orderId: string) {
    return this.orderProductService.getProductsByOrderId(orderId);
  }

  @ApiBody({ type: NewOrderForm })
  @Post()
  create(@Body() cartDto: CartProductDto, orderId: string) {
    return this.orderProductService.createOrderProduct(cartDto, orderId);
  }
}
