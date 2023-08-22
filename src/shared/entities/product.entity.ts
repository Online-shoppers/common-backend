import { Entity, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';

import { CategoryDescription } from 'shared/enums/categoryDescription.enum';
import { CategoryImage } from 'shared/enums/categoryImage.enum';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDEntity } from './uuid.entity';

@Entity({
  tableName: 'products',
  discriminatorColumn: 'descr',
  discriminatorValue: 'product',
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'image_url' })
  image_url!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum({
    type: EnumType,
    name: 'category',
    array: true,
    items: () => ProductCategory,
  })
  category!: ProductCategory[];

  @Enum({
    type: EnumType,
    name: 'category_description',
    array: true,
    items: () => CategoryDescription,
  })
  category_description!: CategoryDescription[];

  @Enum({
    type: EnumType,
    name: 'category_image',
    array: true,
    items: () => CategoryImage,
  })
  category_image!: CategoryImage[];

  @Property({ name: 'archived', default: false })
  archived!: boolean;

  @OneToOne(() => CartProductEntity, {
    mappedBy: cartProduct => cartProduct.product,
  })
  cartProduct: CartProductEntity;
}
