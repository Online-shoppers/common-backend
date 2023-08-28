import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Body, Injectable } from '@nestjs/common';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { SortProduct } from 'shared/enums/sort-products.enum';

import { CreateSnackForm } from '../dto/create-snack.form';
import { SnacksPaginationResponse } from '../dto/pagination-response.dto';
import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';
import { SnackSortFields } from '../enums/snack-sort-fields.enum';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {
  async getSnacksList(
    page: number,
    size: number,
    includeArchived: boolean,
    sortDirection: SortProduct,
    sortByField: string,
  ) {
    if (
      !Object.values(SnackSortFields).includes(sortByField as SnackSortFields)
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

    const response: SnacksPaginationResponse = {
      info: { total },
      items: await SnacksDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getSnackById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException('Product does not exist');
    }
  }

  async createSnack(snackData: CreateSnackForm) {
    const snack = this.em.create(SnacksEntity, {
      ...snackData,
      category: ProductCategories.SNACKS,
    });
    await this.getEntityManager().persistAndFlush(snack);

    return snack;
  }

  async updateSnack(snackEntity: SnacksEntity) {
    await this.getEntityManager().persistAndFlush(snackEntity);
    return snackEntity;
  }

  async archiveSnack(snacksId: string) {
    const em = this.getEntityManager();

    const snack = await this.getSnackById(snacksId);
    snack.archived = true;

    await em.persistAndFlush(snack);

    return SnacksDTO.fromEntity(snack);
  }
}
