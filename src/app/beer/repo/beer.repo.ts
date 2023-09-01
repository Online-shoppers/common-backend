import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { BeerEntity } from '../entities/beer.entity';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {}
