import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { AccessoryDTO } from '../dto/accessory.dto';
import { AccessoryPaginationResponse } from '../dto/pagination-response.dto';
import { AccessoryEntity } from '../entities/accessory.entity';

@Injectable()
export class AccessoryRepo extends EntityRepository<AccessoryEntity> {
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
      items: AccessoryDTO.fromEntities(pageItems),
    };

    return response;
  }

  async getAccessoryById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException('Product does not exist');
    }
  }
  async createAccessory(
    accessoryData: Partial<AccessoryEntity>,
  ): Promise<AccessoryEntity> {
    const accessory = this.em.create(AccessoryEntity, accessoryData);
    await this.getEntityManager().persistAndFlush(accessory);
    return accessory;
  }
  async updateAccessory(
    id: string,
    updateData: Partial<AccessoryEntity>,
  ): Promise<AccessoryEntity | null> {
    const accessory = await this.findOne({ id });

    if (!accessory) {
      return null;
    }

    Object.assign(accessory, updateData);

    await this.getEntityManager().persistAndFlush(accessory);
    return accessory;
  }
  async archiveAccessory(accessoryId: string) {
    const accessory = await this.getAccessoryById(accessoryId);
    accessory.archived = true;
    await this.getEntityManager().persistAndFlush(accessory);
    return AccessoryDTO.fromEntity(accessory);
  }
}
