import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { SortProduct } from 'shared/enums/sort-products.enum';

import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerRepo } from './repo/beer.repo';

@Injectable()
export class BeerService {
  constructor(private readonly repo_beer: BeerRepo) {}

  async getPageBeer(
    page: number,
    size: number,
    includeArchived: boolean,
    sortDirection: SortProduct,
    sortByField: string,
  ) {
    return this.repo_beer.getBeerList(
      page,
      size,
      includeArchived,
      sortDirection,
      sortByField,
    );
  }

  async getBeerInfo(id: string) {
    return this.repo_beer.getBeerById(id);
  }

  async createBeer(beerData: CreateBeerForm) {
    const created = await this.repo_beer.createBeer(beerData);
    return BeerDTO.fromEntity(created);
  }

  async updateBeer(id: string, updateData: UpdateBeerForm) {
    const existing = await this.repo_beer.getBeerById(id);

    const data = wrap(existing).assign(updateData, { merge: true });
    const updated = await this.repo_beer.updateBeer(data);

    return BeerDTO.fromEntity(updated);
  }

  async archiveBeer(beerId: string) {
    return this.repo_beer.archiveBeer(beerId);
  }
}
