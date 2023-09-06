import { Collection } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';
import { ProductTypes } from 'app/products/enums/product-types.enum';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnacksEntity } from './entities/snack.entity';
import { SnackSorting } from './enums/snack-sorting.enum';
import { SnacksRepo } from './repo/snack.repo';
import { SnacksService } from './snacks.service';

const mockSnacks: SnacksEntity[] = [
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Nachos',
    description: 'The best',
    category: ProductCategories.SNACKS,
    type: ProductTypes.NACHOS,
    price: 5,
    rating: () => Promise.resolve(0),
    quantity: 100,
    weight: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'nachos'),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Pretzel',
    description: 'The best',
    category: ProductCategories.SNACKS,
    type: ProductTypes.PRETZELS,
    price: 10,
    rating: () => Promise.resolve(0),
    quantity: 100,
    weight: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'pretzel'),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Bucket of wings',
    description: 'The best',
    category: ProductCategories.SNACKS,
    type: ProductTypes.SPICY_WINGS,
    price: 12,
    rating: () => Promise.resolve(0),
    quantity: 110,
    weight: 100,
    image_url: faker.image.imageUrl(undefined, undefined, 'chicken wings'),
    reviewsAmount: () => Promise.resolve(0),
    archived: true,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
];

const repoSnacksMock = {
  find: jest.fn(() => mockSnacks),

  findOne: jest.fn(() => mockSnacks[0]),

  findOneOrFail: jest.fn((where: { id: string }) => {
    const result = mockSnacks.find(product => product.id === where.id);
    if (!result) {
      throw new BadRequestException('Not found');
    }
    return result;
  }),

  count: jest.fn(() => mockSnacks.length),

  getEntityManager: jest.fn(() => ({
    persistAndFlush: () => Promise.resolve(),
    assign: (entity: SnacksEntity, updateData: UpdateSnackForm) => ({
      ...entity,
      ...updateData,
    }),
  })),

  create: jest.fn((data: Partial<SnacksEntity>): SnacksEntity => {
    return {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: 'New snack',
      description: 'Description',
      category: ProductCategories.SNACKS,
      type: ProductTypes.PRETZELS,
      price: 0,
      weight: 100,
      archived: false,
      quantity: 100,
      image_url: faker.image.unsplash.food(undefined, undefined, 'pretzels'),
      rating: () => Promise.resolve(0),
      reviewsAmount: () => Promise.resolve(0),
      reviews: new Collection<ReviewEntity>(this),
      cartProducts: new Collection<CartProductEntity>(this),
      ...data,
    };
  }),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('SnacksService', () => {
  let service: SnacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnacksService,
        { provide: SnacksRepo, useValue: repoSnacksMock },
        { provide: I18nService, useValue: i18nServiceMock },
      ],
    }).compile();

    service = module.get<SnacksService>(SnacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error on getting not existing snack', async () => {
    try {
      await service.getSnackById('1234');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return snack by id', async () => {
    const product = await service.getSnackById(mockSnacks[0].id);

    expect(product).toStrictEqual(mockSnacks[0]);
    expect(product.id).toEqual(mockSnacks[0].id);
  });

  it('should get list of snacks', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_asc,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
  });

  it('should get list of snack with archived', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = true;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_asc,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(3);
  });

  // Sortings
  it('should sort by price asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_asc,
    );

    const sorted: SnacksPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    expect(sorted.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by price desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_desc,
    );

    const sorted: SnacksPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    expect(sorted.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by volume asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_desc,
    );

    const sorted: SnacksPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    expect(sorted.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by volume desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      SnackSorting.price_desc,
    );

    const sorted: SnacksPaginationResponse = {
      info: { ...list.info },
      items: [...list.items],
    };

    expect(sorted.items.length).toBeGreaterThanOrEqual(0);
  });

  // Manipulations
  it('should create Snack', async () => {
    const item = mockSnacks[0];

    const createForm = CreateSnackForm.from(item);
    const created = await service.createSnack(createForm);

    expect(created).toBeInstanceOf(SnacksDTO);
  });

  it('should update Snack', async () => {
    const item = mockSnacks[0];

    const updateForm = UpdateSnackForm.from(item);
    const updated = await service.updateSnack(item.id, updateForm);

    expect(updated).toBeInstanceOf(SnacksDTO);
  });

  it('should archive Snack', async () => {
    const item = mockSnacks[0];

    const updated = await service.archiveSnack(item.id);

    expect(updated.archived).toBe(true);
    expect(updated).toBeInstanceOf(SnacksDTO);
  });
});
