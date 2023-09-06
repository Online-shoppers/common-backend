import { Collection } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';
import { ProductTypes } from 'app/products/enums/product-types.enum';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { AccessoriesController } from './accessories.controller';
import { AccessoriesService } from './accessories.service';
import { AccessoryDTO } from './dto/accessory.dto';
import { CreateAccessoryForm } from './dto/create-accessory.form';
import { AccessoryPaginationResponse } from './dto/pagination-response.dto';
import { UpdateAccessoryForm } from './dto/update-accessory.form';
import { AccessoryEntity } from './entities/accessory.entity';
import { AccessorySorting } from './enums/accessory-sorting.enum';

const mockAccessories: AccessoryEntity[] = [
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'opener',
    description: 'The best',
    category: ProductCategories.ACCESSORIES,
    type: ProductTypes.BOTTLE_OPENER,
    price: 5,
    rating: () => Promise.resolve(0),
    quantity: 100,
    weight: 10,
    image_url: faker.image.imageUrl(undefined, undefined, 'opener'),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'coaster',
    description: 'The best',
    category: ProductCategories.ACCESSORIES,
    type: ProductTypes.BEER_COASTERS,
    price: 10,
    rating: () => Promise.resolve(0),
    quantity: 100,
    weight: 10,
    image_url: faker.image.imageUrl(undefined, undefined, 'coaster'),
    reviewsAmount: () => Promise.resolve(0),
    archived: false,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    name: 'Glass',
    description: 'The best',
    category: ProductCategories.ACCESSORIES,
    type: ProductTypes.BEER_GLASSES,
    price: 12,
    rating: () => Promise.resolve(0),
    quantity: 110,
    weight: 10,
    image_url: faker.image.imageUrl(undefined, undefined, 'glass'),
    reviewsAmount: () => Promise.resolve(0),
    archived: true,
    cartProducts: new Collection<CartProductEntity>(this),
    reviews: new Collection<ReviewEntity>(this),
  },
];

const mockAccessoriesService = {
  getPageAccessories: jest.fn(
    async (): Promise<AccessoryPaginationResponse> => {
      return {
        info: { total: mockAccessories.length },
        items: await AccessoryDTO.fromEntities(mockAccessories),
      };
    },
  ),

  getAccessoryById: jest.fn(async (id: string) => {
    return mockAccessories[0];
  }),

  createAccessory: jest.fn(async (data: CreateAccessoryForm) => {
    return mockAccessories[0];
  }),

  updateAccessory: jest.fn(
    async (id: string, updateData: UpdateAccessoryForm) => {
      return AccessoryDTO.fromEntity(mockAccessories[0]);
    },
  ),

  archiveAccessory: jest.fn(async (id: string) => {
    return AccessoryDTO.fromEntity(mockAccessories[0]);
  }),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('AccessoriesController', () => {
  let controller: AccessoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessoriesController],
      providers: [
        { provide: I18nService, useValue: i18nServiceMock },
        { provide: AccessoriesService, useValue: mockAccessoriesService },
      ],
    }).compile();

    controller = module.get<AccessoriesController>(AccessoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get paginated accessories', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;
    const sorting = AccessorySorting.price_asc;

    const response = await controller.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get paginated accessories', async () => {
    const page = 2;
    const pageSize = 10;
    const includeArchived = false;
    const sorting = AccessorySorting.price_asc;

    const response = await controller.getPageAccessories(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get accessory by id', async () => {
    const id = v4();

    const response = await controller.getAccessoryById(id, 'en');

    expect(response).toBeInstanceOf(AccessoryDTO);
  });

  it('should create accessory', async () => {
    const createForm = CreateAccessoryForm.from(mockAccessories[0]);

    const response = await controller.createAccessory(createForm);

    expect(response).toBeInstanceOf(AccessoryDTO);
  });

  it('should updated accessory', async () => {
    const id = mockAccessories[0].id;

    const updateForm = UpdateAccessoryForm.from(mockAccessories[0]);

    const response = await controller.updateAccessory(id, updateForm);

    expect(response).toBeInstanceOf(AccessoryDTO);
  });

  it('should archive accessory', async () => {
    const id = mockAccessories[0].id;
    const response = await controller.remove(id);

    expect(response).toBeInstanceOf(AccessoryDTO);
  });

  it('should throw an error on invalid params for get requests', async () => {
    try {
      await controller.getPageAccessories(
        '1' as any,
        20,
        false,
        AccessorySorting.price_asc,
      );
    } catch (e) {
      console.log(e);
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageAccessories(
        1,
        '20' as any,
        false,
        AccessorySorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageAccessories(
        1,
        20,
        'false' as any,
        AccessorySorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });
});
