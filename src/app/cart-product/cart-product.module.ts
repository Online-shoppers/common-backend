import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductController } from './cart-product.controller';
import { CartProductService } from './cart-product.service';
import { CartProductEntity } from './entities/cart-product.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CartProductEntity])],
  controllers: [CartProductController],
  providers: [CartProductService],
})
export class CartProductModule {}
