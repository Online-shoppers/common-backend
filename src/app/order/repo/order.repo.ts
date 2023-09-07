import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderRepo extends EntityRepository<OrderEntity> {}
