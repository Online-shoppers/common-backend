import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { NewOrderForm } from './dto/new-order.form';
import { OrderDTO } from './dto/order.dto';
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderRepo } from './repo/order.repo';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly userService: UserService,
  ) {}

  async createOrder(orderForm: NewOrderForm) {
    const userEntity = await this.userService.getUserById(orderForm.buyerId);

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
    const em = this.orderRepo.getEntityManager();

    await em.persistAndFlush(order);

    return OrderDTO.fromEntity(order);
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
