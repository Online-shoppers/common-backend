import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductsModule } from 'app/products/products.module';
import { ProductsService } from 'app/products/products.service';
import { UserEntity } from 'app/user/entities/user.entity';
import { UserModule } from 'app/user/user.module';

import { ReviewEntity } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ReviewEntity, UserEntity, ProductEntity]),
    UserModule,
    ProductsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
