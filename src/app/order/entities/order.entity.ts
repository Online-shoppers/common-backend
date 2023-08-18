import { Entity, Enum, Property } from '@mikro-orm/core';

import { UUIDEntity } from 'shared/entities/uuid.entity';
import { OrderStatuses } from 'shared/enums/order-statuses.enum';

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
}
