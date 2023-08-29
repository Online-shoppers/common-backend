import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnacksEntity } from './entities/snack.entity';
import { SnackSorting } from './enums/snack-sorting.enum';
import { SnacksRepo } from './repo/snack.repo';

@Injectable()
export class SnacksService {
  constructor(private readonly repo_snacks: SnacksRepo) {}

  async getPageSnacks(
    page: number,
    size: number,
    includeArchived: boolean,
    sortOption: SnackSorting,
  ) {
    return this.repo_snacks.getSnacksList(
      page,
      size,
      includeArchived,
      sortOption,
    );
  }

  async getSnackInfo(id: string) {
    return this.repo_snacks.getSnackById(id);
  }

  async createSnack(createData: CreateSnackForm) {
    const created = await this.repo_snacks.createSnack(createData);
    return SnacksDTO.fromEntity(created);
  }

  async updateSnack(id: string, updateData: UpdateSnackForm) {
    const existing = await this.repo_snacks.getSnackById(id);

    const data = wrap(existing).assign(updateData, { merge: true });
    const updated = await this.repo_snacks.updateSnack(data);

    return SnacksDTO.fromEntity(updated);
  }

  async archiveSnack(snacksId: string) {
    return this.repo_snacks.archiveSnack(snacksId);
  }
}
