import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { EditOrderForm } from './dto/edit-order.form';
import { NewOrderForm } from './dto/new-order.form';
import { OrderRepo } from './repo/order.repo';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async create(orderForm: NewOrderForm) {
    const order = this.orderRepo.create(orderForm);
    const em = this.orderRepo.getEntityManager();

    await em.persistAndFlush(order);

    return order;
  }

  findAll() {
    return this.orderRepo.findAll();
  }

  findOne(id: string) {
    return this.orderRepo.findOne({ id });
  }

  async update(id: string, updateOrderDto: EditOrderForm) {
    const existing = await this.orderRepo.getById(id);
    const em = this.orderRepo.getEntityManager();

    const edited = wrap(existing).assign(
      { ...updateOrderDto, created: existing.created },
      { mergeObjects: true },
    );

    await em.persistAndFlush(edited);

    return edited;
  }

  remove(id: string) {
    return this.orderRepo.nativeDelete({ id });
  }
}
