import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { SnacksPaginationResponse } from '../dto/pagination-response.dto';
import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';

@Injectable()
export class SnacksRepo extends EntityRepository<SnacksEntity> {
  async getBeerList(page: number, size: number, includeArchived: boolean) {
    const archived = includeArchived ? { $in: [true, false] } : false;

    const [total, pageItems] = await Promise.all([
      this.count({ archived }),
      this.find({ archived }, { offset: size * page - size, limit: size }),
    ]);

    const response: SnacksPaginationResponse = {
      info: { total },
      items: SnacksDTO.fromEntities(pageItems),
    };

    return response;
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
