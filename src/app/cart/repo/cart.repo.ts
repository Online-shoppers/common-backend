import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartRepo extends EntityRepository<CartEntity> {}
