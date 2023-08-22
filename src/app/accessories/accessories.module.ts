import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AccessoriesController } from './accessories.controller';
import { AccessoriesService } from './accessories.service';
import { AccessoryEntity } from './entities/accessory.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [AccessoryEntity],
    }),
  ],
  controllers: [AccessoriesController],
  providers: [AccessoriesService],
})
export class AccessoriesModule {}
