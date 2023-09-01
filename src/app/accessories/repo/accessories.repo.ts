import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { AccessoryEntity } from '../entities/accessory.entity';

@Injectable()
export class AccessoryRepo extends EntityRepository<AccessoryEntity> {}
