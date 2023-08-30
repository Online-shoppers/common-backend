import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import { BeerDTO } from '../dto/beer.dto';
import { CreateBeerForm } from '../dto/create-beer.form';
import { BeerPaginationResponse } from '../dto/pagination-response.dto';
import { BeerEntity } from '../entities/beer.entity';
import { BeerSorting } from '../enums/beer-sorting.enum';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {
  async getBeerList(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: BeerSorting,
  ) {
    const [field, direction] = sortOption.split(':');
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find(
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
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException(ErrorCodes.NotExists_Product);
    }
  }

  async createBeer(beerData: CreateBeerForm) {
    const beer = this.em.create(BeerEntity, {
      ...beerData,
      category: ProductCategories.BEER,
    });
    await this.getEntityManager().persistAndFlush(beer);

    return beer;
  }

  async updateBeer(beerEntity: BeerEntity) {
    await this.getEntityManager().persistAndFlush(beerEntity);
    return beerEntity;
  }

  async archiveBeer(beerId: string) {
    const em = this.getEntityManager();

    const beer = await this.getBeerById(beerId);
    beer.archived = true;

    await em.persistAndFlush(beer);

    return BeerDTO.fromEntity(beer);
  }
}
