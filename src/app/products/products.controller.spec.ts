import { Collection } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isBoolean } from 'lodash';
import { v4 } from 'uuid';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { FilterProductsForm } from './dtos/filter-products.form';
import { ProductEntity } from './entities/product.entity';
import { ProductCategories } from './enums/product-categories.enum';
import { ProductTypes } from './enums/product-types.enum';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

const mockProducts: ProductEntity[] = [
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Ale',
    description: 'The best',
    category: ProductCategories.BEER,
    type: ProductTypes.ALE,
    price: 5,
    rating: () => Promise.resolve(0),
    quantity: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'ale'),
    reviews: new Collection<ReviewEntity>(this),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Wheat beer',
    description: 'The best',
    category: ProductCategories.BEER,
    type: ProductTypes.WHEAT_BEER,
    price: 10,
    rating: () => Promise.resolve(0),
    quantity: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'wheat beer'),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Lager',
    description: 'The best',
    category: ProductCategories.BEER,
    type: ProductTypes.LAGER,
    price: 12,
    rating: () => Promise.resolve(0),
    quantity: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'lager'),
    reviewsAmount: () => Promise.resolve(0),
    archived: true,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
];

const productsServiceMock = {
  getProductById: jest.fn((id: string) => {
    const result = mockProducts.find(product => product.id === id);
    if (!result) {
      throw new BadRequestException('Not found');
    }
    return result;
  }),
  getProductsList: jest.fn(
    (
      page: number,
      size: number,
      includeArchived?: boolean,
      filters: FilterProductsForm = { name: '' },
    ) => {
      const { name } = filters;

      const allProducts = mockProducts.filter(product => {
        let isValid = true;

        if (name) {
          const matches = product.name.toLowerCase().includes(name);
          isValid = isValid && matches;
        }

        if (!isBoolean(includeArchived)) {
          isValid = isValid && !product.archived;
        }

        return isValid;
      });

      const count = allProducts.length;
      const offset = size * page - size;
      const limit = size;

      const pageProducts = allProducts.slice(offset, offset + limit - 1);

      return {
        info: {
          total: count,
        },
        items: pageProducts,
      };
    },
  ),
};

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get list of products', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = true;
    const name = '';

    const list = await controller.getProducts(
      page,
      pageSize,
      includeArchived,
      name,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(3);
  });

  it('should get list of products', async () => {
    const page = 2;
    const pageSize = 2;
    const includeArchived = true;
    const name = '';

    const list = await controller.getProducts(
      page,
      pageSize,
      includeArchived,
      name,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(1);
  });

  it('should get empty list when large page passed', async () => {
    const page = 1000;
    const pageSize = 20;
    const includeArchived = true;
    const name = '';

    const list = await controller.getProducts(
      page,
      pageSize,
      includeArchived,
      name,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(0);
  });

  it('should filter products by name', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;
    const name = 'ale';

    const list = await controller.getProducts(
      page,
      pageSize,
      includeArchived,
      name,
    );

    expect(list.items.length).toEqual(1);
  });

  it('should get product by id', async () => {
    const id = mockProducts[0].id;

    const product = await controller.getProductById(id, 'en');

    expect(product.id).toEqual(id);
  });
});
