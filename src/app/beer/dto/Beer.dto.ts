import { IsEnum, IsNumber, IsString } from 'class-validator';

import { BeerType } from 'app/beer/enums/beerType.enum';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { BeerEntity } from '../entities/beer.entity';

export class BeerDTO extends ProductDTO {
  @IsNumber()
  abv: number;

  @IsString()
  country: string;

  @IsNumber()
  volume: number;

  @IsNumber()
  ibu: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsEnum(BeerType)
  type: BeerType;

  static fromEntity(entity?: BeerEntity) {
    if (!entity) {
      return;
    }
    const it = new BeerDTO();
    it.abv = entity.abv;
    it.country = entity.country;
    it.volume = entity.volume;
    it.ibu = entity.ibu;
    it.price = entity.price;
    it.quantity = entity.quantity;
    it.type = entity.type;
    return it;
  }

  static fromEntities(entities?: BeerEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
