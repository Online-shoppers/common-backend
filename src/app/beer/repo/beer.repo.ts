import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { BeerDTO } from '../dto/beer.dto';
import { BeerEntity } from '../entities/beer.entity';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {
  async getList() {
    return await this.findAll();
  }
  async getById(id: string) {
    return await this.findOne({ id });
  }
  async archiveBeer(beerId: string) {
    const beer = await this.findOne({ id: beerId });
    beer.archived = true;
    await this.getEntityManager().persistAndFlush(beer);
    return BeerDTO.fromEntity(beer);
  }
}
