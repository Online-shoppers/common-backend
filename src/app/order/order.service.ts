import { Injectable } from '@nestjs/common';

import { OrderProductRepo } from 'app/order-item/repo/order-product.repo';

import { CartProductRepo } from '../cart-product/repo/cart-product.repo';
import { UserService } from '../user/user.service';
import { NewOrderForm } from './dto/new-order.form';
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

  async createOrder(userId: string, orderForm: NewOrderForm) {
    const userEntity = await this.userService.getUserById(userId);
    const cartProducts = await this.cartProductRepo.find(
      {
        cart: userEntity.cart,
      },
      { populate: true },
    );

    const em = this.orderRepo.getEntityManager();

    const order = this.orderRepo.create({
      status: OrderStatuses.PENDING,
      country: orderForm.country,
      city: orderForm.city,
      zipCode: orderForm.zipCode,
      address: orderForm.address,
      phone: orderForm.phone,
      buyer: userEntity,
      orderProducts: [],
    });

    const orderProducts = cartProducts.map(cartProduct =>
      this.orderProductRepo.create({
        name: cartProduct.name,
        description: cartProduct.description,
        category: cartProduct.category,
        price: cartProduct.product.price,
        imageUrl: cartProduct.product.image_url,
        quantity: cartProduct.quantity,
        productId: cartProduct.product.id,
        order,
      }),
    );

    order.orderProducts.add(orderProducts);
    await em.persistAndFlush(order);

    await this.cartProductRepo.nativeDelete(cartProducts);

    return order;
  }

  findUserOrders(userId: string) {
    return this.orderRepo.find({ buyer: { id: userId } });
  }

  findOne(orderId: string) {
    return this.orderRepo.findOne({ id: orderId });
  }

  async getOrderById(id: string) {
    return this.orderRepo.findOneOrFail({ id });
  }

  async update(id: string, status: OrderStatuses) {
    const em = this.orderRepo.getEntityManager();

    const existing = await this.getOrderById(id);
    existing.status = status;

    await em.persistAndFlush(existing);

    return existing;
  }

  remove(id: string) {
    return this.orderRepo.nativeDelete({ id });
  }
}
