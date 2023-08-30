import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { OrderProductRepo } from '../repo/order-product.repo';

@Entity({
  customRepository: () => OrderProductRepo,
})
export class OrderProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @ManyToOne(() => OrderEntity)
  order?: OrderEntity;
}
