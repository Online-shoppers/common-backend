import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductCategory } from 'shared/enums/productCategory.enum';
import { SortProduct } from 'shared/enums/sort-products.enum';

import { BeerDTO } from '../dto/beer.dto';
import { CreateBeerForm } from '../dto/create-beer.form';
import { BeerPaginationResponse } from '../dto/pagination-response.dto';
import { BeerEntity } from '../entities/beer.entity';
import { BeerSortFields } from '../enums/beer-sort-fields.enum';

@Injectable()
export class BeerRepo extends EntityRepository<BeerEntity> {
  async getBeerList(
    page: number,
    size: number,
    includeArchived: boolean,
    sortDirection: SortProduct,
    sortByField: string,
  ) {
    if (
      !Object.values(BeerSortFields).includes(sortByField as BeerSortFields)
    ) {
      throw new Error(`Недопустимое поле сортировки "${sortByField}"`);
    }
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find(
        { archived },
        {
          offset: size * page - size,
          limit: size,
          orderBy: {
            [sortByField]: sortDirection,
          },
        },
      ),
    ]);

    const response: BeerPaginationResponse = {
      info: { total },
      items: BeerDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getBeerById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException('Product does not exist');
    }
  }

  async createBeer(beerData: CreateBeerForm) {
    const beer = this.em.create(BeerEntity, {
      ...beerData,
      category: ProductCategory.BEER,
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
