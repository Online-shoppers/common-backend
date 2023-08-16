import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepo } from './repo/product.repo';

// Импорт DTO

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ProductEntity, ProductRepo],
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
