import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserEntity } from '../user/entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserRoleEntity],
    }),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}
