import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RefreshTokenEntity } from '../refresh-token/entity/refresh-token.entity';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepo } from '../user/repos/user.repo';
import { AtStrategyService } from './at-strategy.service';
import { SecurityService } from './security.service';

@Module({
  imports: [
    JwtModule,
    MikroOrmModule.forFeature({
      entities: [UserEntity, RefreshTokenEntity, UserRoleEntity],
    }),
    PassportModule.register({ defaultStrategy: AtStrategyService.name }),
  ],
  providers: [SecurityService, AtStrategyService, UserRepo],
  exports: [SecurityService],
})
export class SecurityModule {}
