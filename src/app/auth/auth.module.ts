import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { RefreshTokenEntity } from '../refresh-token/entity/refresh-token.entity';
import { SecurityModule } from '../security/security.module';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserRoleEntity, RefreshTokenEntity],
    }),
    SecurityModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
