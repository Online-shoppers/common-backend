import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {
  async getSnacksList() {
    return this.findAll();
  }
  async getSnacksById(id: string) {
    try {
      const product = await this.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException('Product does not exist');
    }
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
  async archiveSnack(snacksId: string) {
    const em = this.getEntityManager();

    const snack = await this.getSnacksById(snacksId);
    snack.archived = true;

    await em.persistAndFlush(snack);

    return SnacksDTO.fromEntity(snack);
  }
}
