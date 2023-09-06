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
import { JwtPermissionsGuard } from 'app/security/guards/jwt-permission.guard';

import { BeerController } from './beer.controller';
import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { BeerPaginationResponse } from './dto/pagination-response.dto';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerEntity } from './entities/beer.entity';
import { BeerSorting } from './enums/beer-sorting.enum';

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

const mockBeerService = {
  getPageBeer: jest.fn(async (): Promise<BeerPaginationResponse> => {
    return {
      info: { total: mockBeer.length },
      items: await BeerDTO.fromEntities(mockBeer),
    };
  }),

  getBeerById: jest.fn(async (id: string) => {
    return mockBeer[0];
  }),

  createBeer: jest.fn(async (beerData: CreateBeerForm) => {
    return BeerDTO.fromEntity(mockBeer[0]);
  }),

  updateBeer: jest.fn(async (id: string, updateData: UpdateBeerForm) => {
    return BeerDTO.fromEntity(mockBeer[0]);
  }),

  archiveBeer: jest.fn(async (beerId: string) => {
    return BeerDTO.fromEntity(mockBeer[0]);
  }),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('ProductController', () => {
  let controller: BeerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeerController],
      providers: [
        {
          provide: JwtPermissionsGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        { provide: I18nService, useValue: i18nServiceMock },
        {
          provide: BeerService,
          useValue: mockBeerService,
        },
      ],
    }).compile();

    controller = module.get<BeerController>(BeerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get paginated beer', async () => {
    const page = 1;
    const pageSize = 20;
    const includeArchived = false;
    const sorting = BeerSorting.price_asc;

    const response = await controller.getPageBeer(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get paginated beer', async () => {
    const page = 2;
    const pageSize = 10;
    const includeArchived = false;
    const sorting = BeerSorting.price_asc;

    const response = await controller.getPageBeer(
      page,
      pageSize,
      includeArchived,
      sorting,
    );

    expect(response.items.length).toBeGreaterThanOrEqual(0);
    expect(response.info.total).toBeGreaterThanOrEqual(0);
  });

  it('should get beer by id', async () => {
    const id = v4();

    const response = await controller.getBeerById(id);

    expect(response).toBeInstanceOf(BeerDTO);
  });

  it('should create beer', async () => {
    const createForm = CreateBeerForm.from(mockBeer[0]);

    const response = await controller.createBeer(createForm);

    expect(response).toBeInstanceOf(BeerDTO);
  });

  it('should updated beer', async () => {
    const id = mockBeer[0].id;

    const updateForm = UpdateBeerForm.from(mockBeer[0]);

    const response = await controller.updateBeer(id, updateForm);

    expect(response).toBeInstanceOf(BeerDTO);
  });

  it('should archive beer', async () => {
    const id = mockBeer[0].id;
    const response = await controller.remove(id);

    expect(response).toBeInstanceOf(BeerDTO);
  });

  it('should throw an error on invalid params for get requests', async () => {
    try {
      await controller.getPageBeer(
        '1' as any,
        20,
        false,
        BeerSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageBeer(
        1,
        '20' as any,
        false,
        BeerSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }

    try {
      await controller.getPageBeer(
        1,
        20,
        'false' as any,
        BeerSorting.price_asc,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });
});
