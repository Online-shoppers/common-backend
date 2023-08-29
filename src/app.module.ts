// ========== modules ==========
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'lodash';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { AccessoriesModule } from 'app/accessories/accessories.module';
import { AuthModule } from 'app/auth/auth.module';
import { BeerModule } from 'app/beer/beer.module';
import { CartModule } from 'app/cart/cart.module';
import { OrderProductModule } from 'app/order-item/order-product.module';
import { OrderModule } from 'app/order/order.module';
import { RefreshTokenModule } from 'app/refresh-token/refresh-token.module';
import { SecurityModule } from 'app/security/security.module';
import { SnacksModule } from 'app/snacks/snacks.module';
import { UserRolesModule } from 'app/user-roles/user-roles.module';
import { UserModule } from 'app/user/user.module';

import { NotificationsService } from 'shared/notifications/user/userNotification.service';

import { ProductsModule } from './app/products/products.module';
import { ReviewsModule } from './app/reviews/reviews.module';
// ========== configs ==========
import app_config from './config/app.config';
import database_config from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [app_config, database_config],
      isGlobal: true,
    }),
    {
      ...I18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: 'src/resources/i18n/',
          watch: true,
        },
        resolvers: [
          { use: QueryResolver, options: ['lang'] },
          AcceptLanguageResolver,
          new HeaderResolver(['x-lang']),
        ],
      }),
      global: true,
    },
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    SnacksModule,
    BeerModule,
    AccessoriesModule,
    UserModule,
    CartModule,
    SecurityModule,
    UserRolesModule,
    AuthModule,
    RefreshTokenModule,
    OrderModule,
    OrderProductModule,
    ProductsModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
