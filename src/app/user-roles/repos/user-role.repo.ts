import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { UserRoleEntity } from '../entities/user-role.entity';

@Injectable()
export class UserRolesRepo extends EntityRepository<UserRoleEntity> {}
