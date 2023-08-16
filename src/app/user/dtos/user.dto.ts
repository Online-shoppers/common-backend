import { ApiProperty } from '@nestjs/swagger';

import { UUIDDto } from '../../../shared/dtos/uuid.dto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends UUIDDto {
  @ApiProperty({
    description: 'User email',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
  })
  lastName!: string;

  @ApiProperty({
    description: 'User password',
  })
  password!: string;

  @ApiProperty({ description: 'Is user account archived' })
  archived!: boolean;
  static fromEntity(entity?: UserEntity) {
    if (!entity) {
      return;
    }
    const it = new UserDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.email = entity.email;
    it.password = entity.password;
    it.lastName = entity.lastName;
    it.firstName = entity.firstName;
    it.archived = entity.archived;
    return it;
  }

  static fromEntities(entities?: UserEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
