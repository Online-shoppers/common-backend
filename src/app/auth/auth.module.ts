import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserRolesService } from 'app/user-roles/user-roles.service';
import { UserEntity } from 'app/user/entities/user.entity';
import { UserService } from 'app/user/user.service';

import { RefreshTokenEntity } from '../refresh-token/entity/refresh-token.entity';
import { SecurityModule } from '../security/security.module';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserRoleEntity, RefreshTokenEntity, UserEntity],
    }),
    SecurityModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserRolesService],
})
export class AuthModule {}
