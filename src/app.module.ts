// ========== modules ==========
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccessoriesModule } from 'app/accessories/accessories.module';
import { BeerModule } from 'app/beer/beer.module';
import { SnacksModule } from 'app/snacks/snacks.module';

import { AuthModule } from './app/auth/auth.module';
import { CartProductModule } from './app/cart-product/cart-product.module';
import { CartModule } from './app/cart/cart.module';
import { OrderProductModule } from './app/order-item/order-product.module';
import { OrderModule } from './app/order/order.module';
import { RefreshTokenModule } from './app/refresh-token/refresh-token.module';
import { SecurityModule } from './app/security/security.module';
import { UserRolesModule } from './app/user-roles/user-roles.module';
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
    SnacksModule,
    BeerModule,
    AccessoriesModule,
    UserModule,
    CartProductModule,
    CartModule,
    SecurityModule,
    UserRolesModule,
    AuthModule,
    RefreshTokenModule,
    OrderModule,
    OrderProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
