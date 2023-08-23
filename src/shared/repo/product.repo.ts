import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepo extends EntityRepository<ProductEntity> {}
