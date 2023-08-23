import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProductEntity } from '../../shared/entities/product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderProductEntity } from './entity/order-product.entity';
import { OrderProductController } from './order-product.controller';
import { OrderProductService } from './order-product.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderEntity, OrderProductEntity, ProductEntity],
    }),
  ],
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
