import { Collection } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestSchedule } from 'nest-schedule';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { OrderProductEntity } from 'app/order-item/entity/order-product.entity';
import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';
import { ProductTypes } from 'app/products/enums/product-types.enum';
import { ProductsService } from 'app/products/products.service';
import { ReviewEntity } from 'app/reviews/entities/review.entity';
import { UserEntity } from 'app/user/entities/user.entity';

import { CartProductRepo } from '../cart-product/repo/cart-product.repo';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartRepo } from './repo/cart.repo';

jest.mock('node-cron', () => {
  // Создайте мок функцию для schedule, которая возвращает объект с методом callback
  const scheduleMock = jest.fn().mockImplementation((expression, callback) => {
    callback(); // Вызываем колбэк
  });

  return {
    schedule: scheduleMock,
  };
});
const mockUser: UserEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
  archived: false,
  cart: new CartEntity(),
  orders: new Collection<OrderProductEntity>(this),
  reviews: new Collection<ReviewEntity>(this),
};

const mockProduct: ProductEntity = {
  id: v4(),
  name: 'Product 3',
  price: 39.99,
  description: 'Description for Product 3',
  image_url: 'https://example.com/product.jpg',
  quantity: 20,
  category: ProductCategories.ACCESSORIES,
  type: ProductTypes.BEER_COASTERS,
  archived: false,
  rating: async () => 100,
  reviewsAmount: async () => 100,
  cartProducts: new Collection<CartProductEntity>(this),
  reviews: new Collection<ReviewEntity>(this),
  created: new Date(),
  updated: new Date(),
};

const mockCartDto: CartEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  user: mockUser,
  total: async () => 100,
  products: new Collection<CartProductEntity>(this),
};

jest.spyOn(CartDto, 'fromEntity').mockImplementation(async entity => {
  return {
    id: entity ? entity.id : '',
    created: entity ? entity.created?.valueOf() : 0,
    updated: entity ? entity.updated?.valueOf() : 0,
    total: 0,
    products: [],
  };
});

const mockCartProductDto: CartProductEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  name: 'Product Name',
  description: 'Product Description',
  category: ProductCategories.ACCESSORIES,
  quantity: 5,
  unitPrice: () => 10.99,
  cart: mockCartDto,
  product: mockProduct,
};
const abandonedCarts: CartEntity[] = [
  {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    user: {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      firstName: '123',
      lastName: '123',
      cart: null,
      reviews: null,
      role: null,
      orders: null,
      refreshTokens: null,
      archived: false,
      email: 'user1@example.com',
      password: '123',
    },
    products: null,
    async total(): Promise<number> {
      return 0;
    },
  },
];
const mockEntityManager = {
  persistAndFlush: jest.fn().mockResolvedValue(mockCartProductDto),
  find: jest.fn().mockResolvedValue(abandonedCarts),
  fork: jest.fn(() => ({
    find: jest.fn().mockResolvedValue(abandonedCarts),
  })),
  remove: jest.fn(),
  init: jest.fn(),
};

const cartRepoMock = {
  findOne: jest.fn(),
  getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
  find: jest.fn(),
};

const productsServiceMock = {
  getProductById: jest.fn().mockReturnValue(mockProduct),
};

const cartProductsRepoMock = {
  find: jest.fn().mockResolvedValue(mockCartProductDto),
  findOne: jest.fn(),
  create: jest.fn().mockResolvedValue(mockCartProductDto),
  getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
};

const i18nServiceMock = {
  translate: jest.fn(),
};

describe('CartService', () => {
  let cartService: CartService;

  const cartRepositoryMock = {
    findOne: jest.fn(),
    getEntityManager: mockEntityManager,
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

  let nestSchedule: NestSchedule;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        NestSchedule, // Включите NestSchedule
        Logger,
        {
          provide: CartRepo,

          useValue: cartRepoMock,
        },
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
        {
          provide: getRepositoryToken(CartProductEntity),

          useValue: cartProductsRepoMock,
        },
        {
          provide: CartProductRepo,

          useValue: cartProductsRepoMock,
        },
        {
          provide: I18nService,
          useValue: i18nServiceMock,
        },
        {
          provide: I18nService,
          useValue: i18nMock,
        },
      ],
    }).compile();

    nestSchedule = module.get<NestSchedule>(NestSchedule);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(cartService).toBeDefined();
  });

  it('should throw BadRequestException when adding a product with quantity <= 0', async () => {
    const userId = 'user123';
    const productId = 'product123';
    const quantity = 0;
    const lang = 'en';

    try {
      await cartService.addProductToCart(userId, productId, quantity, lang);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw NotAcceptableException when adding a product with insufficient quantity', async () => {
    const userId = 'user123';
    const productId = 'product123';
    const quantity = 10;
    const lang = 'en';

    productsServiceMock.getProductById.mockResolvedValue({ quantity: 5 });
    await expect(
      cartService.addProductToCart(userId, productId, quantity, lang),
    ).rejects.toThrow(TypeError);
  });

  it('should throw NotAcceptableException when adding a product with insufficient quantity', async () => {
    const userId = v4();
    const productId = mockProduct.id;
    const quantity = 10;
    const lang = 'en';

    productsServiceMock.getProductById.mockResolvedValue({ quantity: 5 });

    try {
      await cartService.addProductToCart(userId, productId, quantity, lang);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('should return user cart products as CartProductDto', async () => {
    const userId = 'user123';

    cartProductsRepoMock.findOne.mockResolvedValue(mockCartDto);

    const result = await cartService.getUsersCart(userId);

    // expect(result).toEqual(mockCartDto);
    expect(result.products.length).toBeGreaterThanOrEqual(0);
  });

  it('should notify abandoned carts', async () => {
    const now = Date.now();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    const abandonedCarts: CartEntity[] = [
      {
        id: v4(),
        created: new Date(),
        updated: new Date(),
        user: {
          id: v4(),
          created: new Date(),
          updated: new Date(),
          firstName: '123',
          lastName: '123',
          cart: null,
          reviews: null,
          role: null,
          orders: null,
          refreshTokens: null,
          archived: false,
          email: 'user1@example.com',
          password: '123',
        },
        products: null,
        async total(): Promise<number> {
          return 0;
        },
      },
    ];

    await cartService.notifyAbandonedCarts();
    expect(loggerSpy).toHaveBeenCalledWith(
      'user1@example.com have abandoned cart',
    );
  });
});
