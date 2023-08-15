import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity({
  tableName: 'user',
})
export class UserEntity {
  @PrimaryKey({
    type: 'number',
  })
  id: number;
}
