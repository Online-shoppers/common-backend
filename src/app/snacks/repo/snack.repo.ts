import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {
  async getSnacksList() {
    return await this.findAll();
  }
  async getSnacksById(id: string) {
    return await this.findOne({ id });
  }
  async createSnacks(snacksData: Partial<SnacksEntity>): Promise<SnacksEntity> {
    const snacks = this.em.create(SnacksEntity, snacksData);
    await this.getEntityManager().persistAndFlush(snacks);
    return snacks;
  }
  async updateSnacks(
    id: string,
    updateData: Partial<SnacksEntity>,
  ): Promise<SnacksEntity | null> {
    const snacks = await this.findOne({ id });

    if (!snacks) {
      return null;
    }

    Object.assign(snacks, updateData);

    await this.getEntityManager().persistAndFlush(snacks);
    return snacks;
  }
  async archiveSnacks(snacksId: string) {
    const snacks = await this.findOne({ id: snacksId });
    snacks.archived = true;
    await this.getEntityManager().persistAndFlush(snacks);
    return SnacksDTO.fromEntity(snacks);
  }
}
