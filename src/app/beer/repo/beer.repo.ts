import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ProductCategory } from 'shared/enums/productCategory.enum';

import { BeerDTO } from '../dto/beer.dto';
import { NewBeerForm } from '../dto/new-beer.form';
import { BeerEntity } from '../entities/beer.entity';
import { BeerType } from '../enums/beerType.enum';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {
  async getList() {
    return await this.findAll();
  }

  async getById(id: string) {
    return await this.findOne({ id });
  }

  async getAllProductsSortedByPriceAsc() {
    return this.em.find(BeerEntity, {}, { orderBy: { price: 'ASC' } });
  }

  async getAllProductsSortedByPriceDesc() {
    return this.em.find(BeerEntity, {}, { orderBy: { price: 'DESC' } });
  }

  async createBeer(beerData: NewBeerForm): Promise<BeerEntity> {
    // const beer = this.em.create(BeerEntity, beerData);
    const beer = this.create({
      name: beerData.name,
      price: beerData.price,
      description: beerData.description,
      image_url: beerData.image_url,
      quantity: beerData.quantity,
      abv: beerData.abv,
      ibu: beerData.ibu,
      volume: beerData.volume,
      type: BeerType.TYPE_X,
      // type: beerData.type,
      country: beerData.country,
      category: ProductCategory.CATEGORY_BEER,
    });
    console.log(beer);
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
    const beer = await this.findOne({ id: beerId });
    beer.archived = true;
    await this.getEntityManager().persistAndFlush(beer);
    return BeerDTO.fromEntity(beer);
  }
}
