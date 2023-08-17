import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { BeerEntity } from '../entities/beer.entity';

export class BeerDTO extends ProductDTO {
  @IsNumber()
  abv: number;

  @IsString()
  country: string;

  @IsNumber()
  ibu: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  availability: boolean;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  archived: boolean;

  static fromEntity(entity?: BeerEntity) {
    if (!entity) {
      return;
    }
    const it = new BeerDTO();
    it.id = entity.id;
    it.name = entity.name;
    it.abv = entity.abv;
    it.description = entity.description;
    it.country = entity.country;
    it.ibu = entity.ibu;
    it.price = entity.price;
    it.availability = entity.availability;
    it.quantity = entity.quantity;
    it.archived = entity.archived;
    return it;
  }

  static fromEntities(entities?: BeerEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
