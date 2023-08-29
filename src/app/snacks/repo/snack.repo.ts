import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import { CreateSnackForm } from '../dto/create-snack.form';
import { SnacksPaginationResponse } from '../dto/pagination-response.dto';
import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';
import { SnackSortFields } from '../enums/snack-sort-fields.enum';
import { SnackSorting } from '../enums/snack-sorting.enum';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {
  constructor(em: EntityManager, private readonly i18nSerivice: I18nService) {
    super(em, SnacksEntity);
  }

  async getSnacksList(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: SnackSorting,
  ) {
    const [field, order] = sortOption.split(':');
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find(
        { archived },
        {
          offset: size * page - size,
          limit: size,
          orderBy: {
            [field]: order,
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
      throw new BadRequestException(
        this.i18nSerivice.translate(ErrorCodes.NotExists_Product),
      );
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
