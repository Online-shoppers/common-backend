import { Injectable } from '@nestjs/common';

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
  async archiveBeer(beerId: string) {
    return await this.repo_beer.archiveBeer(beerId);
  }
}
