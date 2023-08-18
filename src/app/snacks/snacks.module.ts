import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { SnacksEntity } from './entities/snack.entity';
import { SnacksController } from './snacks.controller';
import { SnacksService } from './snacks.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [SnacksEntity],
    }),
  ],
  controllers: [SnacksController],
  providers: [SnacksService],
})
export class SnacksModule {}
