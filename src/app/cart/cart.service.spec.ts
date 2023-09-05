import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductsService } from 'app/products/products.service';

import { CartService } from './cart.service';
import { CartRepo } from './repo/cart.repo';

describe('CartService', () => {
  let service: CartService;

  const cartRepositoryMock = {
    findOne: jest.fn(() => ({})),
    getEntityManager: jest.fn(() => ({})),
  };

  const cartProductRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const productsServiceMock = {
    getProductById: jest.fn(),
  };

  const i18nMock = {
    translate: jest.fn().mockResolvedValue('hello'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartRepo,
          useValue: cartRepositoryMock,
        },
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: cartProductRepositoryMock,
        },
        {
          provide: I18nService,
          useValue: i18nMock,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
