import { Injectable } from '@nestjs/common';

import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  create(ProductDto: ProductDTO) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
