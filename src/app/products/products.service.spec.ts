import { Collection } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isBoolean } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { isRegExp } from 'util/types';
import { v4 } from 'uuid';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { ProductEntity } from './entities/product.entity';
import { ProductCategories } from './enums/product-categories.enum';
import { ProductTypes } from './enums/product-types.enum';
import { ProductsService } from './products.service';
import { ProductRepo } from './repo/product.repo';

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
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
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

const productsRepoMock = {
  find: jest.fn(
    (
      where: {
        name: string | RegExp;
        archived: boolean | { $in: [boolean, boolean] | boolean[] };
      } = {
        name: '',
        archived: false,
      },
      options: { offset: number; limit: number },
    ) =>
      mockProducts
        .filter(product => {
          let isValid = true;

          const name = where.name;

          if (isRegExp(name)) {
            const matches = product.name.match(name);
            isValid = isValid && matches && matches.length > 0;
          } else {
            isValid =
              isValid &&
              product.name.toLowerCase().includes(name.toLowerCase());
          }

          const archived = where.archived;
          if (isBoolean(archived)) {
            isValid = isValid && product.archived === archived;
          } else {
            isValid = isValid && archived.$in.includes(product.archived);
          }

          return isValid;
        })
        .slice(options.offset, options.offset + options.limit - 1),
  ),

  findOne: jest.fn((where: { id: string }) =>
    mockProducts.find(product => product.id === where.id),
  ),

  findOneOrFail: jest.fn((where: { id: string }) => {
    const result = mockProducts.find(product => product.id === where.id);
    if (!result) {
      throw new BadRequestException('Not found');
    }
    return result;
  }),

  count: jest.fn(
    (
      where: {
        name: string;
        archived: boolean | { $in: [boolean, boolean] | boolean[] };
      } = { name: '', archived: false },
    ) => {
      const { name, archived } = where;

      return mockProducts.filter(product => {
        let isValid = true;

        if (isRegExp(name)) {
          const matches = product.name.match(name);
          isValid = isValid && matches && matches.length > 0;
        } else {
          isValid =
            isValid && product.name.toLowerCase().includes(name.toLowerCase());
        }

        if (isBoolean(archived)) {
          isValid = isValid && product.archived === archived;
        } else {
          isValid = isValid && archived.$in.includes(product.archived);
        }

        return isValid;
      }).length;
    },
  ),

  getEntityManager: jest.fn(() => ({})),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ProductsService,
        {
          provide: ProductRepo,
          useValue: productsRepoMock,
        },
        { provide: I18nService, useValue: i18nServiceMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error on getting not existing product', async () => {
    try {
      await service.getProductById('1234', 'en');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return product by id', async () => {
    const product = await service.getProductById(mockProducts[0].id, 'en');
    expect(product).toStrictEqual(mockProducts[0]);
    expect(product.id).toEqual(mockProducts[0].id);
  });

  it('should get list of products', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getProductsList(
      page,
      pageSize,
      includeArchived,
      { name: '' },
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);

    if (!includeArchived) {
      expect(list.items.map(item => item.archived)).not.toContain(true);
    }
  });

  it('should get list of products with archived', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = true;

    const list = await service.getProductsList(
      page,
      pageSize,
      includeArchived,
      { name: '' },
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(3);
  });

  it('should filter products by name', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getProductsList(
      page,
      pageSize,
      includeArchived,
      { name: 'Ale' },
    );

    expect(list.items.length).toEqual(1);
  });
});
