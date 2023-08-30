import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { OrderProductEntity } from './entity/order-product.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderProductEntity],
    }),
  ],
  controllers: [],
  providers: [],
})
export class OrderProductModule {}
