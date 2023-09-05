import { Collection } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isBoolean } from 'lodash';
import { v4 } from 'uuid';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';
import { ProductTypes } from 'app/products/enums/product-types.enum';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { BeerPaginationResponse } from './dto/pagination-response.dto';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerEntity } from './entities/beer.entity';
import { BeerSortFields } from './enums/beer-sort-fields.enum';
import { BeerSorting } from './enums/beer-sorting.enum';
import { BeerRepo } from './repo/beer.repo';

const mockBeer: BeerEntity[] = [
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
    abv: 1,
    ibu: 1,
    volume: 1,
    country: 'Belarus',
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
    abv: 1,
    ibu: 1,
    volume: 1,
    country: 'Belarus',
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
    quantity: 110,
    abv: 1,
    ibu: 1,
    volume: 1,
    country: 'Belarus',
    image_url: faker.image.imageUrl(undefined, undefined, 'lager'),
    reviewsAmount: () => Promise.resolve(0),
    archived: true,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
];

const beerRepoMock = {
  find: jest.fn(
    (
      where: {
        name: string | RegExp;
        archived: boolean | { $in: [boolean, boolean] | boolean[] };
      } = {
        name: '',
        archived: false,
      },
      options: {
        offset: number;
        limit: number;
        orderBy: Record<BeerSortFields, 'asc' | 'desc'>;
      },
    ) =>
      mockBeer
        .filter(product => {
          let isValid = true;

          const archived = where.archived;
          if (isBoolean(archived)) {
            isValid = isValid && product.archived === archived;
          } else {
            isValid = isValid && archived.$in.includes(product.archived);
          }

          return isValid;
        })
        .sort((a: BeerEntity, b: BeerEntity) => {
          const orders = Object.keys(options.orderBy).reverse();

          if (orders.length === 0) {
            // price asc
            return a.price - b.price;
          }

          const order = orders[0];

          let mod = a[order] - b[order];

          if (options.orderBy[order] === 'desc') {
            mod = -mod;
          }

          return mod;
        })
        .slice(options.offset, options.offset + options.limit - 1),
  ),

  findOne: jest.fn((where: { id: string }) =>
    mockBeer.find(product => product.id === where.id),
  ),

  findOneOrFail: jest.fn((where: { id: string }) => {
    const result = mockBeer.find(product => product.id === where.id);
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
      const { archived } = where;

      return mockBeer.filter(product => {
        let isValid = true;

        if (isBoolean(archived)) {
          isValid = isValid && product.archived === archived;
        } else {
          isValid = isValid && archived.$in.includes(product.archived);
        }

        return isValid;
      }).length;
    },
  ),

  getEntityManager: jest.fn(() => ({
    persistAndFlush: () => Promise.resolve(),
    assign: (entity: BeerEntity, updateData: UpdateBeerForm) => ({
      ...entity,
      ...updateData,
    }),
  })),

  create: jest.fn((data: Partial<BeerEntity>): BeerEntity => {
    return {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: 'New beer',
      description: 'Description',
      category: ProductCategories.BEER,
      type: ProductTypes.ALE,
      volume: 0,
      price: 0,
      country: 'Belarus',
      ibu: 1,
      abv: 1,
      archived: false,
      quantity: 100,
      image_url: faker.image.unsplash.food(undefined, undefined, 'beer'),
      rating: () => Promise.resolve(0),
      reviewsAmount: () => Promise.resolve(0),
      reviews: new Collection<ReviewEntity>(this),
      cartProducts: new Collection<CartProductEntity>(this),
      ...data,
    };
  }),
};

describe('BeerService', () => {
  let service: BeerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeerService,
        {
          provide: BeerRepo,
          useValue: beerRepoMock,
        },
      ],
    }).compile();

    service = module.get<BeerService>(BeerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error on getting not existing product', async () => {
    try {
      await service.getBeerById('1234');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return product by id', async () => {
    const product = await service.getBeerById(mockBeer[0].id);
    expect(product).toStrictEqual(mockBeer[0]);
    expect(product.id).toEqual(mockBeer[0].id);
  });

  it('should get list of products', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_asc,
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

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_asc,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(3);
  });

  // Sortings
  it('should sort by price asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_asc,
    );

    const sorted: BeerPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    sorted.items.sort((a, b) => a.price - b.price);

    expect(sorted.items).toStrictEqual(list.items);
  });

  it('should sort by price desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_desc,
    );

    const sorted: BeerPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    sorted.items.sort((a, b) => b.price - a.price);

    expect(sorted.items).toStrictEqual(list.items);
  });

  it('should sort by volume asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_desc,
    );

    const sorted: BeerPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    sorted.items.sort((a, b) => a.volume - b.volume);

    expect(sorted.items).toStrictEqual(list.items);
  });

  it('should sort by volume desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageBeer(
      page,
      pageSize,
      includeArchived,
      BeerSorting.price_desc,
    );

    const sorted: BeerPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    sorted.items.sort((a, b) => b.volume - a.volume);

    expect(sorted.items).toStrictEqual(list.items);
  });

  // Manipulations
  it('should create Beer', async () => {
    const item = mockBeer[0];

    const createForm = CreateBeerForm.from(item);
    const created = await service.createBeer(createForm);

    expect(created).toBeInstanceOf(BeerDTO);
  });

  it('should update Beer', async () => {
    const item = mockBeer[0];

    const updateForm = UpdateBeerForm.from(item);
    const updated = await service.updateBeer(item.id, updateForm);

    expect(updated).toBeInstanceOf(BeerDTO);
  });

  it('should archive Beer', async () => {
    const item = mockBeer[0];

    const updated = await service.archiveBeer(item.id);

    expect(updated.archived).toBe(true);
    expect(updated).toBeInstanceOf(BeerDTO);
  });
});
