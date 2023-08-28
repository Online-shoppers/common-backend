import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { FilterProductsForm } from '../dtos/filter-products.form';
import { ProductsPaginationResponse } from '../dtos/pagination-response.dto';
import { ProductDTO } from '../dtos/product.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepo extends EntityRepository<ProductEntity> {
  async getProductById(id: string) {
    try {
      const user = await this.findOneOrFail({ id });
      return user;
    } catch (err) {
      throw new BadRequestException('No user found');
    }
  }

  async getProductsList(
    page: number,
    size: number,
    includeArchived: boolean,
    filters: FilterProductsForm,
  ) {
    const name = new RegExp(`(?<![\w])(${filters.name})(?![\w])`, 'i');

    const where: FilterQuery<ProductEntity> = {
      archived: includeArchived ? { $in: [true, false] } : false,
      name,
    };

    const [total, pageItems] = await Promise.all([
      this.count(where),
      this.find(where, { offset: size * page - size, limit: size }),
    ]);

    const response: ProductsPaginationResponse = {
      info: { total },
      items: await ProductDTO.fromEntities(pageItems),
    };

    return response;
  }
}