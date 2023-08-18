import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserRoleEntity],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
