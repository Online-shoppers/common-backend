import { Injectable } from '@nestjs/common';

import { BeerDTO } from './dto/beer.dto';
import { BeerEntity } from './entities/beer.entity';
import { BeerRepo } from './repo/beer.repo';

@Injectable()
export class BeerService {
  constructor(private readonly repo_beer: BeerRepo) {}
  async getAllBeers() {
    return await this.repo_beer.getList();
  }
  async getBeerInfo(id: string) {
    return await this.repo_beer.getById(id);
  }
  async createBeer(beerData: Partial<BeerDTO>): Promise<BeerEntity> {
    const beerEntityData: Partial<BeerEntity> = {
      id: beerData.id,
      name: beerData.name,
      description: beerData.description,
      category: beerData.category,
      archived: beerData.archived,
      abv: beerData.abv,
      country: beerData.country,
      volume: beerData.volume,
      ibu: beerData.ibu,
      price: beerData.price,
      quantity: beerData.quantity,
      type: beerData.type,
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
