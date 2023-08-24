import { Injectable } from '@nestjs/common';

import { SnacksDTO } from './dto/snack.dto';
import { SnacksEntity } from './entities/snack.entity';
import { SnacksRepo } from './repo/snack.repo';

@Injectable()
export class SnacksService {
  constructor(private readonly repo_snacks: SnacksRepo) {}

  async getPageSnacks(page: number, size: number, includeArchived: boolean) {
    return this.repo_snacks.getBeerList(page, size, includeArchived);
  }

  async getSnacksInfo(id: string) {
    return await this.repo_snacks.getSnacksById(id);
  }

  async createSnacks(snacksData: Partial<SnacksDTO>): Promise<SnacksEntity> {
    const snacksEntityData: Partial<SnacksEntity> = {
      id: snacksData.id,
      name: snacksData.name,
      price: snacksData.price,
      description: snacksData.description,
      image_url: snacksData.image_url,
      quantity: snacksData.quantity,
      category: snacksData.category,
      type: snacksData.type,
      archived: snacksData.archived,
      weight: snacksData.weight,
    };

    return this.repo_snacks.createSnacks(snacksEntityData);
  }
  async updateSnacks(
    id: string,
    updateData: Partial<SnacksDTO>,
  ): Promise<SnacksEntity | null> {
    const existingSnacks = await this.repo_snacks.getSnacksById(id);

    if (!existingSnacks) {
      return null;
    }

    const { created, updated, ...updateFields } = updateData;

    Object.assign(existingSnacks, updateFields);

    return this.repo_snacks.updateSnacks(id, existingSnacks);
  }

  async archiveSnacks(snacksId: string) {
    return this.repo_snacks.archiveSnack(snacksId);
  }
}
