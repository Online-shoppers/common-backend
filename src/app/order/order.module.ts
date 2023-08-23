import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { OrderProductEntity } from '../order-item/entity/order-product.entity';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderEntity, OrderProductEntity, UserEntity, UserRoleEntity],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, UserService],
})
export class OrderModule {}
