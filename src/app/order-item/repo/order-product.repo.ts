import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { OrderProductEntity } from '../entity/order-product.entity';

@Injectable()
export class OrderProductRepo extends EntityRepository<OrderProductEntity> {}
