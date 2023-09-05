import { wrap } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnackSorting } from './enums/snack-sorting.enum';
import { SnacksRepo } from './repo/snack.repo';

@Injectable()
export class SnacksService {
  constructor(
    private readonly repo_snacks: SnacksRepo,
    private readonly i18nSerivice: I18nService,
  ) {}

  async getPageSnacks(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: SnackSorting,
  ) {
    const [field, order] = sortOption.split(':');
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.repo_snacks.count({ archived }),
      this.repo_snacks.find(
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
      const snack = await this.repo_snacks.findOneOrFail({ id });
      return snack;
    } catch (err) {
      throw new BadRequestException(
        this.i18nSerivice.t(ErrorCodes.NotExists_Product, {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  async createSnack(data: CreateSnackForm) {
    const em = this.repo_snacks.getEntityManager();

    const snack = this.repo_snacks.create({
      ...data,
      category: ProductCategories.SNACKS,
    });
    await em.persistAndFlush(snack);

    return SnacksDTO.fromEntity(snack);
  }

  async updateSnack(id: string, updateData: UpdateSnackForm) {
    const em = this.repo_snacks.getEntityManager();

    const existing = await this.getSnackById(id);

    const data = wrap(existing).assign(updateData, { merge: true });
    await em.persistAndFlush(data);

    return SnacksDTO.fromEntity(data);
  }

  async archiveSnack(snacksId: string) {
    const em = this.repo_snacks.getEntityManager();

    const snack = await this.getSnackById(snacksId);
    snack.archived = true;

    await em.persistAndFlush(snack);

    return SnacksDTO.fromEntity(snack);
  }
}
