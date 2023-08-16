import { Injectable } from '@nestjs/common';

import { UserRepo } from './repos/user.repo';

@Injectable()
export class UserService {
  constructor(private readonly repo_user: UserRepo) {}
  async getUsers() {
    return await this.repo_user.getList();
  }
  async getUserInfo(userId: string) {
    return await this.repo_user.getById(userId);
  }

  async archiveUser(userId: string) {
    return await this.repo_user.archiveUser(userId);
  }
}
