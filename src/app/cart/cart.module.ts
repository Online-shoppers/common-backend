import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductRepo } from 'app/cart-product/repo/cart-product.repo';

import { ProductEntity } from 'shared/entities/product.entity';
import { ProductRepo } from 'shared/repo/product.repo';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CartEntity, ProductEntity])],
  controllers: [CartController],
  providers: [CartService, CartProductRepo, ProductRepo],
})
export class CartModule {}
