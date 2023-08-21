// ========== modules ==========
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './app/auth/auth.module';
import { RefreshTokenModule } from './app/refresh-token/refresh-token.module';
import { SecurityModule } from './app/security/security.module';
import { UserRoles } from './app/user-roles/enums/user-roles.enum';
import { UserRolesModule } from './app/user-roles/user-roles.module';
import { AccessoriesModule } from 'app/accessories/accessories.module';
import { BeerModule } from 'app/beer/beer.module';
import { SnacksModule } from 'app/snacks/snacks.module';
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
    SnacksModule,
    BeerModule,
    AccessoriesModule,
    UserModule,
    SecurityModule,
    UserRolesModule,
    AuthModule,
    RefreshTokenModule,
    OrderModule,
  ],
})
export class AppModule {}
