import { Injectable } from '@nestjs/common';

import { FilterProductsForm } from './dtos/filter-products.form';
import { ProductRepo } from './repo/product.repo';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductRepo) {}

  async getProductsList(
    page: number,
    size: number,
    includeArchived: boolean,
    filters: FilterProductsForm,
  ) {
    return this.productsRepo.getProductsList(
      page,
      size,
      includeArchived,
      filters,
    );
  }
}
