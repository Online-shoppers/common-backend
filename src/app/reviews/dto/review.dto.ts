import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { ReviewEntity } from '../entities/review.entity';

export class ReviewDto extends UUIDDto {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @IsString()
  @ApiProperty()
  text: string;

  @IsInt()
  @ApiProperty()
  rating: number;

  @IsBoolean()
  @ApiProperty()
  edited: boolean;

  @IsBoolean()
  @ApiProperty()
  archived: boolean;

  public static fromEntity(entity: ReviewEntity) {
    const it = new ReviewDto();

    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.userName = entity.user.firstName.concat(' ', entity.user.lastName);
    it.userId = entity.user.id;
    it.text = entity.text;
    it.rating = entity.rating;
    it.edited = entity.edited;
    it.archived = entity.archived;

    return it;
  }

  public static fromEntities(entities?: ReviewEntity[]) {
    if (!Array.isArray(entities)) {
      return [];
    }

    return entities.map(entity => this.fromEntity(entity));
  }
}
