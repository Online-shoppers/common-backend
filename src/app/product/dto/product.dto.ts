import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { ProductEntity } from '../entities/product.entity';
import { ProductSchema } from '../enums/productShema.enum';
import { ProductType } from '../enums/productTypy.enum';

export class ProductDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductSchema)
  schema: ProductSchema;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  weight: number;

  @IsNumber()
  volume: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;

  fromEntity(entity?: ProductEntity) {
    if (!entity) {
      return;
    }
    const productDTO = new ProductDTO();
    productDTO.id = entity.id;
    productDTO.name = entity.name;
    productDTO.description = entity.description;
    productDTO.schema = entity.schema;
    productDTO.type = entity.type;
    productDTO.weight = entity.weight;
    productDTO.volume = entity.volume;
    productDTO.archived = entity.archived;

    return productDTO;
  }

  fromEntities(entities?: ProductEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
