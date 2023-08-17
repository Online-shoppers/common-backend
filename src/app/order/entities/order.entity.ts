import { Entity, Property } from '@mikro-orm/core';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { OrderRepo } from '../repo/order.repo';

@Entity({ tableName: 'order', customRepository: () => OrderRepo })
export class OrderEntity extends UUIDEntity {
  @Property()
  status!: string;

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
