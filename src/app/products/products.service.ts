import { FilterQuery } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { FilterProductsForm } from './dtos/filter-products.form';
import { ProductsPaginationResponse } from './dtos/pagination-response.dto';
import { ProductDTO } from './dtos/product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepo } from './repo/product.repo';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductRepo,
    private readonly i18nService: I18nService,
  ) {}

  async getProductById(id: string) {
    try {
      const product = await this.productsRepo.findOneOrFail({ id });
      return product;
    } catch (err) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NotExists_Product),
      );
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
      this.productsRepo.count(where),
      this.productsRepo.find(where, {
        offset: size * page - size,
        limit: size,
      }),
    ]);

    const response: ProductsPaginationResponse = {
      info: { total },
      items: await ProductDTO.fromEntities(pageItems),
    };

    return response;
  }
}
