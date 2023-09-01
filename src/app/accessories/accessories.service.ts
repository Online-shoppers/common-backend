import { wrap } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { AccessoryDTO } from './dto/accessory.dto';
import { CreateAccessoryForm } from './dto/create-accessory.form';
import { AccessoryPaginationResponse } from './dto/pagination-response.dto';
import { UpdateAccessoryForm } from './dto/update-accessory.form';
import { AccessorySorting } from './enums/accessory-sorting.enum';
import { AccessoryRepo } from './repo/accessories.repo';

@Injectable()
export class AccessoriesService {
  constructor(
    private readonly repo_accessory: AccessoryRepo,
    private readonly i18n: I18nService,
  ) {}

  async getPageAccessories(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: AccessorySorting,
  ) {
    const [field, direction] = sortOption.split(':');
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.repo_accessory.count({ archived }),
      this.repo_accessory.find(
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

    const response: AccessoryPaginationResponse = {
      info: { total },
      items: await AccessoryDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getAccessoryById(id: string) {
    try {
      const accessory = await this.repo_accessory.findOneOrFail({ id });
      return accessory;
    } catch (err) {
      throw new BadRequestException(
        this.i18n.t(ErrorCodes.NotExists_Product, {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  async createAccessory(accessoryData: CreateAccessoryForm) {
    const em = this.repo_accessory.getEntityManager();

    const accessory = this.repo_accessory.create({
      ...accessoryData,
      category: ProductCategories.ACCESSORIES,
    });
    await em.persistAndFlush(accessory);

    return accessory;
  }

  async updateAccessory(id: string, updateData: UpdateAccessoryForm) {
    const em = this.repo_accessory.getEntityManager();

    const existing = await this.getAccessoryById(id);

    const data = wrap(existing).assign(updateData, { merge: true });
    await em.persistAndFlush(data);

    return AccessoryDTO.fromEntity(data);
  }

  async archiveAccessory(accessoryId: string) {
    const em = this.repo_accessory.getEntityManager();

    const accessory = await this.getAccessoryById(accessoryId);
    accessory.archived = true;

    await em.persistAndFlush(accessory);

    return AccessoryDTO.fromEntity(accessory);
  }
}
