import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { OrderEntity } from 'app/order/entities/order.entity';
import { ProductEntity } from 'app/products/entities/product.entity';

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
