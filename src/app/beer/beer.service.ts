import { Injectable } from '@nestjs/common';

import { BeerRepo } from './repo/beer.repo';

@Injectable()
export class BeerService {
  constructor(private readonly beer_user: BeerRepo) {}
  async getAllBeers() {
    return await this.beer_user.getList();
  }
  async getBeerInfo(id: string) {
    return await this.beer_user.getById(id);
  }
  async archiveUser(beerId: string) {
    return await this.beer_user.archiveUser(beerId);
  }
}
