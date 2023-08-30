import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { UserRoleEntity } from 'app/user-roles/entities/user-role.entity';

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
    MikroOrmModule.forFeature({
      entities: [
        OrderEntity,
        OrderProductEntity,
        UserEntity,
        UserRoleEntity,
        ProductEntity,
        CartProductEntity,
      ],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, UserService, OrderGateway],
})
export class OrderModule {}
