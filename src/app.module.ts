// ========== modules ==========
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BeerModule } from 'app/beer/beer.module';

import { CartProductModule } from './app/cart-product/cart-product.module';
import { CartModule } from './app/cart/cart.module';
import { OrderModule } from './app/order/order.module';
import { UserModule } from './app/user/user.module';
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
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    BeerModule,
    UserModule,
    OrderModule,
    CartProductModule,
    CartModule,
  ],
})
export class AppModule {}
