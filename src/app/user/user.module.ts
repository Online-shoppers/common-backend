import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserRolesModule } from 'app/user-roles/user-roles.module';

import { NotificationsService } from '../../shared/notifications/user/userNotification.service';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), UserRolesModule],
  controllers: [UserController],
  providers: [UserService, NotificationsService],
  exports: [UserService],
})
export class UserModule {}
