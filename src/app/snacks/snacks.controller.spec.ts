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

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnacksEntity } from './entities/snack.entity';
import { SnackSorting } from './enums/snack-sorting.enum';
import { SnacksController } from './snacks.controller';
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

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

const snacksServiceMock = {
  getPageSnacks: jest.fn(async (): Promise<SnacksPaginationResponse> => {
    return {
      info: { total: mockSnacks.length },
      items: await SnacksDTO.fromEntities(mockSnacks),
    };
  }),

  getSnackById: jest.fn(async (id: string) => {
    return mockSnacks[0];
  }),

  createSnack: jest.fn(async (data: CreateSnackForm) => {
    return SnacksDTO.fromEntity(mockSnacks[0]);
  }),

  updateSnack: jest.fn(async (id: string, updateData: UpdateSnackForm) => {
    return SnacksDTO.fromEntity(mockSnacks[0]);
  }),

  archiveSnack: jest.fn(async (id: string) => {
    return SnacksDTO.fromEntity(mockSnacks[0]);
  }),
};

describe('SnacksController', () => {
  let controller: SnacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnacksController],
      providers: [
        { provide: I18nService, useValue: i18nServiceMock },
        { provide: SnacksService, useValue: snacksServiceMock },
      ],
    }).compile();

    controller = module.get<SnacksController>(SnacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get paginated snacks', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;
    const sorting = SnackSorting.price_asc;

    const response = await controller.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get paginated snacks', async () => {
    const page = 2;
    const pageSize = 10;
    const includeArchived = false;
    const sorting = SnackSorting.price_asc;

    const response = await controller.getPageSnacks(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get snack by id', async () => {
    const id = v4();

    const response = await controller.getSnacksById(id, 'en');

    expect(response).toBeInstanceOf(SnacksDTO);
  });

  it('should create snack', async () => {
    const createForm = CreateSnackForm.from(mockSnacks[0]);

    const response = await controller.createSnack(createForm);

    expect(response).toBeInstanceOf(SnacksDTO);
  });

  it('should update snack', async () => {
    const id = mockSnacks[0].id;

    const updateForm = UpdateSnackForm.from(mockSnacks[0]);

    const response = await controller.updateSnack(id, updateForm);

    expect(response).toBeInstanceOf(SnacksDTO);
  });

  it('should archive snack', async () => {
    const id = mockSnacks[0].id;
    const response = await controller.remove(id);

    expect(response).toBeInstanceOf(SnacksDTO);
  });

  it('should throw an error on invalid params for get requests', async () => {
    try {
      await controller.getPageSnacks(
        '1' as any,
        20,
        false,
        SnackSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageSnacks(
        1,
        '20' as any,
        false,
        SnackSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageSnacks(
        1,
        20,
        'false' as any,
        SnackSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });
});
