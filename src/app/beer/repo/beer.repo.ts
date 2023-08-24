import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { BeerDTO } from '../dto/beer.dto';
import { BeerPaginationResponse } from '../dto/pagination-response.dto';
import { BeerEntity } from '../entities/beer.entity';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {
  async getBeerList(page: number, size: number, includeArchived: boolean) {
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find({ archived }, { offset: size * page - size, limit: size }),
    ]);

    const response: BeerPaginationResponse = {
      info: { total },
      items: BeerDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException('Product does not exist');
    }
  }

  async getAllProductsSortedByPriceAsc() {
    return this.em.find(BeerEntity, {}, { orderBy: { price: 'ASC' } });
  }

  async getAllProductsSortedByPriceDesc() {
    return this.em.find(BeerEntity, {}, { orderBy: { price: 'DESC' } });
  }

  async createBeer(beerData: Partial<BeerEntity>): Promise<BeerEntity> {
    const beer = this.em.create(BeerEntity, beerData);
    await this.getEntityManager().persistAndFlush(beer);
    return beer;
  }

  async updateBeer(
    id: string,
    updateData: Partial<BeerEntity>,
  ): Promise<BeerEntity | null> {
    const beer = await this.findOne({ id });

    if (!beer) {
      return null;
    }

    Object.assign(beer, updateData);

    await this.getEntityManager().persistAndFlush(beer);
    return beer;
  }

  async archiveBeer(beerId: string) {
    const beer = await this.getById(beerId);
    beer.archived = true;
    await this.getEntityManager().persistAndFlush(beer);
    return BeerDTO.fromEntity(beer);
  }
}
