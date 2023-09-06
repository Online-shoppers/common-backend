import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

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
  constructor(
    private readonly i18nService: I18nService,
    private readonly repo_beer: BeerRepo,
  ) {}

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

  async getBeerById(id: string, lang: string) {
    try {
      const product = await this.repo_beer.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NotExists_Product, { lang }),
      );
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

  async updateBeer(id: string, updateData: UpdateBeerForm, lang: string) {
    const em = this.repo_beer.getEntityManager();

    const existing = await this.getBeerById(id, lang);

    const data = em.assign(existing, updateData, { merge: true });
    await em.persistAndFlush(data);

    return BeerDTO.fromEntity(data);
  }

  async archiveBeer(beerId: string, lang: string) {
    const em = this.repo_beer.getEntityManager();

    const beer = await this.getBeerById(beerId, lang);
    beer.archived = true;

    await em.persistAndFlush(beer);

    return BeerDTO.fromEntity(beer);
  }
}
