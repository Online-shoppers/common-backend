import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../user/entities/user.entity';
import { RefreshTokenEntity } from '../entity/refresh-token.entity';

@Injectable()
export class RefreshTokenRepo extends EntityRepository<RefreshTokenEntity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, RefreshTokenEntity);
  }

  async addRefreshToken(entity: UserEntity, token: string) {
    const newToken = this.create({
      token: token,
      user: entity,
    });
    await this.getEntityManager().persistAndFlush(newToken);
    return newToken;
  }

  async updateRefreshToken(entity: UserEntity, token: string) {
    const existingToken = await this.findOne({
      token: token,
      user: entity,
    });

    if (existingToken) {
      existingToken.updated = new Date(); // Обновляем дату обновления токена, если это необходимо
      await this.getEntityManager().persistAndFlush(existingToken);
      return existingToken;
    }

    throw new Error('Refresh token not found');
  }
}
