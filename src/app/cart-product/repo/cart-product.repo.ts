import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { CartProductEntity } from '../entities/cart-product.entity';

@Injectable()
export class CartProductRepo extends EntityRepository<CartProductEntity> {}
