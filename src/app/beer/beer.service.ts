import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { BeerPaginationResponse } from './dto/pagination-response.dto';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerSorting } from './enums/beer-sorting.enum';
import { BeerRepo } from './repo/beer.repo';

@Injectable()
export class BeerService {
  constructor(private readonly repo_beer: BeerRepo) {}

  async getPageBeer(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: BeerSorting,
  ) {
    const [field, direction] = sortOption.split(':');
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.repo_beer.count({ archived }),
      this.repo_beer.find(
        { archived },
        {
          offset: size * page - size,
          limit: size,
          orderBy: {
            [field]: direction,
          },
        },
      ),
    ]);

    const response: BeerPaginationResponse = {
      info: { total },
      items: await BeerDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getBeerById(id: string) {
    try {
      const product = await this.repo_beer.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException(ErrorCodes.NotExists_Product);
    }
  }

  async createBeer(beerData: CreateBeerForm) {
    const em = this.repo_beer.getEntityManager();

    const beer = this.repo_beer.create({
      ...beerData,
      category: ProductCategories.BEER,
    });
    await em.persistAndFlush(beer);

    return BeerDTO.fromEntity(beer);
  }

  async updateBeer(id: string, updateData: UpdateBeerForm) {
    const em = this.repo_beer.getEntityManager();

    const existing = await this.getBeerById(id);

    const data = em.assign(existing, updateData, { merge: true });
    await em.persistAndFlush(data);

    return BeerDTO.fromEntity(data);
  }

  async archiveBeer(beerId: string) {
    const em = this.repo_beer.getEntityManager();

    const beer = await this.getBeerById(beerId);
    beer.archived = true;

    await em.persistAndFlush(beer);

    return BeerDTO.fromEntity(beer);
  }
}
