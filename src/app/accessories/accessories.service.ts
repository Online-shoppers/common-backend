import { Injectable } from '@nestjs/common';

import { AccessoryDTO } from './dto/accessory.dto';
import { AccessoryEntity } from './entities/accessory.entity';
import { AccessoryRepo } from './repo/accessories.repo';

@Injectable()
export class AccessoriesService {
  constructor(private readonly repo_accessory: AccessoryRepo) {}
  async getAllAccessories() {
    return await this.repo_accessory.getAccessoriesList();
  }
  async getAccessoryInfo(id: string) {
    return await this.repo_accessory.getAccessoryById(id);
  }
  async createAccessory(
    accessoryData: Partial<AccessoryDTO>,
  ): Promise<AccessoryEntity> {
    const accessoryEntityData: Partial<AccessoryEntity> = {
      id: accessoryData.id,
      name: accessoryData.name,
      price: accessoryData.price,
      description: accessoryData.description,
      image_url: accessoryData.image_url,
      quantity: accessoryData.quantity,
      category: accessoryData.category,
      archived: accessoryData.archived,
      weight: accessoryData.weight,
      type: accessoryData.type,
    };

    return this.repo_accessory.createAccessory(accessoryEntityData);
  }
  async updateAccessory(
    id: string,
    updateData: Partial<AccessoryDTO>,
  ): Promise<AccessoryEntity | null> {
    const existingAccessory = await this.repo_accessory.getAccessoryById(id);

    if (!existingAccessory) {
      return null;
    }

    const { created, updated, ...updateFields } = updateData;

    Object.assign(existingAccessory, updateFields);

    return this.repo_accessory.updateAccessory(id, existingAccessory);
  }

  async archiveAccessory(accessoryId: string) {
    return await this.repo_accessory.archiveAccessory(accessoryId);
  }
}
