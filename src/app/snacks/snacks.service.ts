import { Injectable } from '@nestjs/common';

import { SnackRepo } from './repo/snack.repo';

@Injectable()
export class SnacksService {
  constructor(private readonly repo_snacks: SnackRepo) {}
  async getAllSnacks() {
    return await this.repo_snacks.getSnacksList();
  }
  async getSnackInfo(id: string) {
    return await this.repo_snacks.getSnackById(id);
  }
  async archiveSnack(snackId: string) {
    return await this.repo_snacks.archiveSnack(snackId);
  }
}
