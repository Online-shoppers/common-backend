import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { AccessoryDTO } from '../dto/accessory.dto';
import { AccessoryEntity } from '../entities/accessory.entity';

@Injectable()
export class AccessoryRepo extends EntityRepository<AccessoryEntity> {
  async getAccessoriesList() {
    return await this.findAll();
  }
  async getAccessoryById(id: string) {
    return await this.findOne({ id });
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
    const accessory = await this.findOne({ id: accessoryId });
    accessory.archived = true;
    await this.getEntityManager().persistAndFlush(accessory);
    return AccessoryDTO.fromEntity(accessory);
  }
}
