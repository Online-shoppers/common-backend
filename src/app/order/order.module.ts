import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { UserRoleEntity } from 'app/user-roles/entities/user-role.entity';
import { UserRolesModule } from 'app/user-roles/user-roles.module';
import { UserRolesService } from 'app/user-roles/user-roles.service';

import { OrderProductEntity } from '../order-item/entity/order-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGateway } from './orderGateway';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      UserRoleEntity,
      OrderEntity,
      OrderProductEntity,
      ProductEntity,
      CartProductEntity,
    ]),
    UserRolesModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, UserService, UserRolesService, OrderGateway],
})
export class OrderModule {}
