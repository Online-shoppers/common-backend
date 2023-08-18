import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  async getList() {
    return await this.findAll();
  }
  async getById(id: string) {
    return await this.findOne({ id });
  }
  async archiveUser(userId: string) {
    const user = await this.findOne({ id: userId });
    user.archived = true;
    await this.persistAndFlush(user);
    return UserDto.fromEntity(user);
  }
}
