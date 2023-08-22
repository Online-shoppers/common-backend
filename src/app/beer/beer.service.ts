import { Injectable } from '@nestjs/common';

import { BeerDTO } from './dto/beer.dto';
import { NewBeerForm } from './dto/new-beer.form';
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
    return await sortMethod.call(this.repo_beer);
  }
  async getBeerInfo(id: string) {
    return await this.repo_beer.getById(id);
  }
  async createBeer(beerData: NewBeerForm): Promise<BeerEntity> {
    return this.repo_beer.createBeer(beerData);
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
