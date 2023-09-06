import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';

import { FilterProductsForm } from './dtos/filter-products.form';
import { ProductDTO } from './dtos/product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'size', type: String, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @Get()
  async getProducts(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size = 10,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived = false,
    @Query('name') name = '',
  ) {
    const productFilters = new FilterProductsForm();
    productFilters.name = name;

    return this.productsService.getProductsList(
      page,
      size,
      includeArchived,
      productFilters,
    );
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    const product = await this.productsService.getProductById(id, lang);
    return ProductDTO.fromEntity(product);
  }
}
