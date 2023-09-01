import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SnacksEntity } from '../entities/snack.entity';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {}
