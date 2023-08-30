import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { OrderProductRepo } from '../repo/order-product.repo';

@Entity({
  customRepository: () => OrderProductRepo,
})
export class OrderProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'category' })
  category: ProductCategories;

  @Property({ name: 'image_url' })
  imageUrl: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'quantity' })
  quantity!: number;

  @ManyToOne(() => OrderEntity)
  order?: OrderEntity;

  @Property({ name: 'productId' })
  productId: string;
}
