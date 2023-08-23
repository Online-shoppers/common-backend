import { Injectable } from '@nestjs/common';

import { ProductCategory } from 'shared/enums/productCategory.enum';

import { BeerDTO } from './dto/beer.dto';
import { BeerEntity } from './entities/beer.entity';
import { BeerRepo } from './repo/beer.repo';

@Injectable()
export class BeerService {
  constructor(private readonly repo_beer: BeerRepo) {}
  async getAllBeers(sortOption?: string) {
    const sortMethods = {
      'price-asc': this.repo_beer.getAllProductsSortedByPriceAsc,
      'price-desc': this.repo_beer.getAllProductsSortedByPriceDesc,
    };

    const sortMethod = sortMethods[sortOption] || this.repo_beer.getList();

    return await (typeof sortMethod === 'function'
      ? sortMethod.call(this.repo_beer)
      : sortMethod);
  }

  async getBeerInfo(id: string) {
    return await this.repo_beer.getById(id);
  }
  async createBeer(beerData: Partial<BeerDTO>): Promise<BeerEntity> {
    const beerEntityData: Partial<BeerEntity> = {
      id: beerData.id,
      name: beerData.name,
      price: beerData.price,
      description: beerData.description,
      image_url: beerData.image_url,
      quantity: beerData.quantity,
      category: ProductCategory.CATEGORY_BEER,
      type: beerData.type,
      archived: beerData.archived,
      abv: beerData.abv,
      country: beerData.country,
      volume: beerData.volume,
      ibu: beerData.ibu,
    };
    return this.repo_beer.createBeer(beerEntityData);
  }
  async updateBeer(
    id: string,
    updateData: Partial<BeerDTO>,
  ): Promise<BeerEntity | null> {
    const existingBeer = await this.repo_beer.getById(id);

    if (!existingBeer) {
      return null;
    }

    const { created, updated, ...updateFields } = updateData;

    Object.assign(existingBeer, updateFields);

    return this.repo_beer.updateBeer(id, existingBeer);
  }

  async archiveBeer(beerId: string) {
    return await this.repo_beer.archiveBeer(beerId);
  }
}
