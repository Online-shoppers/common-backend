import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductService } from './cart-product.service';
import { CartProductEntity } from './entities/cart-product.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CartProductEntity])],
  controllers: [],
  providers: [CartProductService],
})
export class CartProductModule {}
