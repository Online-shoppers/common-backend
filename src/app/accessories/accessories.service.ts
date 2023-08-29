import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { AccessoryDTO } from './dto/accessory.dto';
import { CreateAccessoryForm } from './dto/create-accessory.form';
import { UpdateAccessoryForm } from './dto/update-accessory.form';
import { AccessorySorting } from './enums/accessory-sorting.enum';
import { AccessoryRepo } from './repo/accessories.repo';

@Injectable()
export class AccessoriesService {
  constructor(private readonly repo_accessory: AccessoryRepo) {}

  async getPageAccessories(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: AccessorySorting,
  ) {
    return this.repo_accessory.getAccessoriesList(
      page,
      size,
      includeArchived,
      sortOption,
    );
  }

  async getAccessoryInfo(id: string) {
    return this.repo_accessory.getAccessoryById(id);
  }

  async createAccessory(accessoryData: CreateAccessoryForm) {
    const created = await this.repo_accessory.createAccessory(accessoryData);
    return AccessoryDTO.fromEntity(created);
  }

  async updateAccessory(id: string, updateData: UpdateAccessoryForm) {
    const existing = await this.repo_accessory.getAccessoryById(id);

    const data = wrap(existing).assign(updateData, { merge: true });
    const updated = await this.repo_accessory.updateAccessory(data);

    return AccessoryDTO.fromEntity(updated);
  }

  async archiveAccessory(accessoryId: string) {
    return this.repo_accessory.archiveAccessory(accessoryId);
  }
}
