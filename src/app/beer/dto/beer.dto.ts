import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { ProductDTO } from 'app/products/dtos/product.dto';

import { BeerEntity } from '../entities/beer.entity';

export class BeerDTO extends ProductDTO {
  @ApiProperty()
  @IsNumber()
  abv: number;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsNumber()
  ibu: number;

  static async fromEntity(entity?: BeerEntity) {
    if (!entity) {
      return;
    }

    const [rating, reviewsAmount] = await Promise.all([
      await entity.rating(),
      await entity.reviewsAmount(),
    ]);

    const it = new BeerDTO();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.price = entity.price;
    it.description = entity.description;
    it.image_url = entity.image_url;
    it.quantity = entity.quantity;
    it.category = entity.category;
    it.rating = rating;
    it.reviews_amount = reviewsAmount;
    it.type = entity.type;
    it.archived = entity.archived;
    it.abv = entity.abv;
    it.country = entity.country;
    it.volume = entity.volume;
    it.ibu = entity.ibu;
    it.price = entity.price;
    return it;
  }

  static async fromEntities(entities?: BeerEntity[]) {
    if (!entities?.map) {
      return;
    }
    return Promise.all(entities.map(entity => this.fromEntity(entity)));
  }
}
