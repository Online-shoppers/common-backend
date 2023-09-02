import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductsModule } from 'app/products/products.module';
import { ProductsService } from 'app/products/products.service';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([CartEntity, CartProductEntity, ProductEntity]),
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [CartService, ProductsService],
})
export class CartModule {}
