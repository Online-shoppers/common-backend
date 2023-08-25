import { Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { UserEntity } from 'app/user/entities/user.entity';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { OrderProductEntity } from '../../order-item/entity/order-product.entity';
import { OrderStatuses } from '../enums/order-statuses.enum';
import { OrderRepo } from '../repo/order.repo';

@Entity({ tableName: 'order', customRepository: () => OrderRepo })
export class OrderEntity extends UUIDEntity {
  @Enum({ array: false, items: () => OrderStatuses })
  status!: OrderStatuses;

  @Property()
  country!: string;

  @Property()
  city!: string;

  @Property()
  zipCode!: string;

  @Property()
  address!: string;

  @Property()
  phone!: string;

  @ManyToOne(() => UserEntity)
  buyer: UserEntity;

  @OneToMany({
    entity: () => OrderProductEntity,
    mappedBy: product => product.order,
  })
  orderProducts: OrderProductEntity[];
}
