import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import { AccessoryDTO } from '../dto/accessory.dto';
import { CreateAccessoryForm } from '../dto/create-accessory.form';
import { AccessoryPaginationResponse } from '../dto/pagination-response.dto';
import { AccessoryEntity } from '../entities/accessory.entity';

@Injectable()
export class AccessoryRepo extends EntityRepository<AccessoryEntity> {
  constructor(em: EntityManager, private readonly i18n: I18nService) {
    super(em, AccessoryEntity);
  }
  async getAccessoriesList(
    page: number,
    size: number,
    includeArchived: boolean,
  ) {
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find({ archived }, { offset: size * page - size, limit: size }),
    ]);

    const response: AccessoryPaginationResponse = {
      info: { total },
      items: await AccessoryDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getAccessoryById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException(
        this.i18n.translate(ErrorCodes.NotExists_Product),
      );
    }
  }

  async createAccessory(accessoryData: CreateAccessoryForm) {
    const accessory = this.em.create(AccessoryEntity, {
      ...accessoryData,
      category: ProductCategories.ACCESSORIES,
    });
    await this.getEntityManager().persistAndFlush(accessory);

    return accessory;
  }

  async updateAccessory(accessoryEntity: AccessoryEntity) {
    await this.getEntityManager().persistAndFlush(accessoryEntity);
    return accessoryEntity;
  }

  async archiveAccessory(accessoryId: string) {
    const em = this.getEntityManager();

    const accessory = await this.getAccessoryById(accessoryId);
    accessory.archived = true;

    await em.persistAndFlush(accessory);

    return AccessoryDTO.fromEntity(accessory);
  }
}
