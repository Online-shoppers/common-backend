import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { BeerController } from './beer.controller';
import { BeerService } from './beer.service';
import { BeerEntity } from './entities/beer.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [BeerEntity],
    }),
  ],
  controllers: [BeerController],
  providers: [BeerService],
})
export class BeerModule {}
