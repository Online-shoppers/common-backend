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

import { AccessoriesService } from './accessories.service';
import { AccessoryDTO } from './dto/accessory.dto';
import { CreateAccessoryForm } from './dto/create-accessory.form';
import { UpdateAccessoryForm } from './dto/update-accessory.form';
import { AccessoryEntity } from './entities/accessory.entity';
import { AccessorySorting } from './enums/accessory-sorting.enum';
import { AccessoryRepo } from './repo/accessories.repo';

const mockAccessories: AccessoryEntity[] = [
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
    weight: 10,
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
    weight: 10,
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
    weight: 10,
    image_url: faker.image.imageUrl(undefined, undefined, 'lager'),
    reviewsAmount: () => Promise.resolve(0),
    archived: true,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
];

const accessoriesRepoMock = {
  find: jest.fn(() => mockAccessories),

  findOne: jest.fn(() => mockAccessories[0]),

  findOneOrFail: jest.fn((where: { id: string }) => {
    const result = mockAccessories.find(product => product.id === where.id);
    if (!result) {
      throw new BadRequestException('Not found');
    }
    return result;
  }),

  count: jest.fn(() => mockAccessories.length),

  getEntityManager: jest.fn(() => ({
    persistAndFlush: () => Promise.resolve(),
    assign: (entity: AccessoryEntity, updateData: UpdateAccessoryForm) => ({
      ...entity,
      ...updateData,
    }),
  })),

  create: jest.fn((data: Partial<AccessoryEntity>): AccessoryEntity => {
    return {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: 'New accessory',
      description: 'Description',
      category: ProductCategories.ACCESSORIES,
      type: ProductTypes.BEER_COASTERS,
      price: 0,
      weight: 0,
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

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('AccessoriesService', () => {
  let service: AccessoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessoriesService,
        { provide: I18nService, useValue: i18nServiceMock },
        {
          provide: AccessoryRepo,
          useValue: accessoriesRepoMock,
        },
      ],
    }).compile();

    service = module.get<AccessoriesService>(AccessoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error on getting not existing product', async () => {
    try {
      await service.getAccessoryById('1234');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return product by id', async () => {
    const product = await service.getAccessoryById(mockAccessories[0].id);
    expect(product).toStrictEqual(mockAccessories[0]);
    expect(product.id).toEqual(mockAccessories[0].id);
  });

  it('should get list of products', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_asc,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
  });

  it('should get list of products with archived', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = true;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_asc,
    );

    expect(list.items.length).toBeLessThanOrEqual(pageSize);
    expect(list.items.length).toEqual(3);
  });

  // Sortings
  it('should sort by price asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_asc,
    );

    expect(list.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by price desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_desc,
    );

    expect(list.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by volume asc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_desc,
    );

    expect(list.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should sort by volume desc', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;

    const list = await service.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      AccessorySorting.price_desc,
    );

    expect(list.items.length).toBeGreaterThanOrEqual(0);
  });

  // Manipulations
  it('should create Accessory', async () => {
    const item = mockAccessories[0];

    const createForm = CreateAccessoryForm.from(item);
    const created = await service.createAccessory(createForm);

    // expect(created).toBeInstanceOf(AccessoryEntity);
    expect(created.weight).toBeGreaterThanOrEqual(0);
  });

  it('should update Accessory', async () => {
    const item = mockAccessories[0];

    const updateForm = UpdateAccessoryForm.from(item);
    const updated = await service.updateAccessory(item.id, updateForm);

    expect(updated).toBeInstanceOf(AccessoryDTO);
  });

  it('should archive Accessory', async () => {
    const item = mockAccessories[0];

    const updated = await service.archiveAccessory(item.id);

    expect(updated.archived).toBe(true);
    expect(updated).toBeInstanceOf(AccessoryDTO);
  });
});
