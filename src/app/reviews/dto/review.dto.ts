import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { ReviewEntity } from '../entities/review.entity';

export class ReviewDto extends UUIDDto {
  @IsString()
  @ApiProperty()
  summary: string;

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

  @IsUUID()
  @ApiProperty()
  userId: string;

  public static fromEntity(entity: ReviewEntity) {
    const it = new ReviewDto();

    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.summary = entity.summary;
    it.text = entity.text;
    it.rating = entity.rating;
    it.userId = entity.user.id;
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
