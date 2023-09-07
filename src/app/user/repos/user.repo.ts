import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {}
