import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SnacksDTO } from '../dto/snack.dto';
import { SnacksEntity } from '../entities/snack.entity';

@Injectable()
export class SnackRepo extends EntityRepository<SnacksEntity> {
  async getSnacksList() {
    return await this.findAll();
  }
  async getSnackById(id: string) {
    return await this.findOne({ id });
  }
  async archiveSnack(snackId: string) {
    const snack = await this.findOne({ id: snackId });
    snack.archived = true;
    await this.getEntityManager().persistAndFlush(snack);
    return SnacksDTO.fromEntity(snack);
  }
}
