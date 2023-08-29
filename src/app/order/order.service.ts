import { Injectable } from '@nestjs/common';

import { CartProductRepo } from '../cart-product/repo/cart-product.repo';
import { CartRepo } from '../cart/repo/cart.repo';
import { OrderProductRepo } from '../order-item/repo/order-product.repo';
import { UserService } from '../user/user.service';
import { NewOrderForm } from './dto/new-order.form';
import { OrderDTO } from './dto/order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderRepo } from './repo/order.repo';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly userService: UserService,
    private readonly cartProductRepo: CartProductRepo,
    private readonly orderProductRepo: OrderProductRepo,
  ) {}

  async createOrder(orderForm: NewOrderForm) {
    const userEntity = await this.userService.getUserById(orderForm.buyerId);
    const cartProducts = await this.cartProductRepo.find(
      {
        cart: userEntity.cart,
      },
      { populate: true },
    );

    const em = this.orderRepo.getEntityManager();
    const orderProd = cartProducts.map(cartProduct =>
      this.orderProductRepo.create({
        name: cartProduct.name,
        description: cartProduct.description,
        price: cartProduct.product.price,
      }),
    );

    const order = this.orderRepo.create({
      status: orderForm.status,
      country: orderForm.country,
      city: orderForm.city,
      zipCode: orderForm.zipCode,
      address: orderForm.address,
      phone: orderForm.phone,
      buyer: userEntity,
      orderProducts: [],
    });
    order.orderProducts.add(orderProd);
    await em.persistAndFlush(order);

    await this.cartProductRepo.nativeDelete(cartProducts);
    console.log(await this.cartProductRepo.find({ cart: userEntity.cart }));
    return order;
  }

  findAll() {
    return this.orderRepo.findAll();
  }

  findOne(id: string) {
    return this.orderRepo.findOne({ id });
  }

  async update(id: string, status: OrderStatuses) {
    const existing = await this.orderRepo.getById(id);
    const em = this.orderRepo.getEntityManager();
    existing.status = status;

    await em.persistAndFlush(existing);

    return existing;
  }

  remove(id: string) {
    return this.orderRepo.nativeDelete({ id });
  }
}
