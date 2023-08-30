import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID, IsUrl } from 'class-validator';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { UUIDDto } from '../../../shared/dtos/uuid.dto';
import { OrderProductEntity } from '../entity/order-product.entity';

export class OrderProductDTO extends UUIDDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @ApiProperty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsUUID()
  productId: string;

  static fromEntity(entity?: OrderProductEntity) {
    if (!entity) {
      return;
    }

    const it = new OrderProductDTO();

    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.category = entity.category;
    it.name = entity.name;
    it.description = entity.description;
    it.imageUrl = entity.imageUrl;
    it.price = entity.price;
    it.quantity = entity.quantity;
    it.orderId = entity.order.id;
    it.productId = entity.productId;

    return it;
  }

  static fromEntities(entities?: OrderProductEntity[]) {
    if (!Array.isArray(entities)) {
      return [];
    }

    return entities.map(entity => this.fromEntity(entity));
  }
}
