import { Injectable } from '@nestjs/common';

import { ProductRepo } from 'app/products/repo/product.repo';

import { CartProductDto } from '../cart-product/dto/cart-product.dto';
import { OrderRepo } from '../order/repo/order.repo';
import { OrderProductRepo } from './repo/order-product.repo';

@Injectable()
export class OrderProductService {
  constructor(
    private readonly orderProductRepo: OrderProductRepo,
    private readonly productRepo: ProductRepo,
    private readonly orderRepo: OrderRepo,
  ) {}

  async createOrderProduct(cartProductDto: CartProductDto, orderId: string) {
    const productEntity = await this.productRepo.findOne({
      id: cartProductDto.productId,
    });

    const orderEntity = await this.orderRepo.findOne({ id: orderId });
    const orderProduct = this.orderProductRepo.create({
      name: cartProductDto.name,
      price: productEntity.price,
      description: cartProductDto.description,
      order: orderEntity,
    });

    return orderProduct;
  }
  async getProductsByOrderId(orderId: string) {
    return this.orderProductRepo.find({ order: { id: orderId } });
  }
}
