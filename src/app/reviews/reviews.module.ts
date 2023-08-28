import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProductEntity } from 'app/products/entities/product.entity';
import { UserEntity } from 'app/user/entities/user.entity';

import { ReviewEntity } from './entities/review.entity';
import { ReviewRepo } from './repo/review.repo';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity, ReviewEntity, ProductEntity]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepo],
})
export class ReviewsModule {}
