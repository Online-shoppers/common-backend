import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductsModule } from 'app/products/products.module';
import { ProductsService } from 'app/products/products.service';

import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/resources/i18n'),
            watch: true,
          },
          resolvers: [
            new HeaderResolver(['x-lang']),
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),

        MikroOrmModule.forFeature([
          CartEntity,
          CartProductEntity,
          ProductEntity,
        ]),
        ProductsModule,
      ],
      providers: [CartService, ProductsService],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test', () => {
    expect(2 + 2).toEqual(4);
  });
});
