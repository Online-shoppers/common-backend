import { getRepositoryToken } from '@mikro-orm/nestjs';
import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';
import { ProductTypes } from 'app/products/enums/product-types.enum';
import { ProductsService } from 'app/products/products.service';

import { CartService } from './cart.service';
import { CartInfoDto } from './dto/cart-info.dto';
import { CartDto } from './dto/cart.dto';
import { CartRepo } from './repo/cart.repo';

const mockCartDto: any = {
  id: 'mock-cart-id',
  created: new Date().valueOf(),
  updated: new Date().valueOf(),
  total: 100,
  products: [
    {
      id: 'mock-cart-product-id-1',
      created: new Date().valueOf(),
      updated: new Date().valueOf(),
      name: 'Product 1',
      description: 'Product Description 1',
      imageUrl: 'https://example.com/product1.jpg',
      category: 'Accessories',
      quantity: 3,
      unitPrice: 10.99,
      productId: 'product123',
    },
    {
      id: 'mock-cart-product-id-2',
      created: new Date().valueOf(),
      updated: new Date().valueOf(),
      name: 'Product 2',
      description: 'Product Description 2',
      imageUrl: 'https://example.com/product2.jpg',
      category: 'Electronics',
      quantity: 2,
      unitPrice: 49.99,
      productId: 'product456',
    },
  ],
};

const mockProduct3: any = [
  {
    id: v4(),
    name: 'Product 3',
    price: 39.99,
    description: 'Description for Product 3',
    image_url: 'https://example.com/product3.jpg',
    quantity: 20,
    category: ProductCategories.ACCESSORIES, // Use the category specific to AccessoryEntity
    type: ProductTypes.BEER_COASTERS, // Replace with the actual type enum value
    archived: false,
    weight: 0.5, // Include the specific property for AccessoryEntity
  },
];

const mockCartProductDto = {
  id: v4(),
  created: Date.now(),
  updated: Date.now(),
  name: 'Product Name',
  description: 'Product Description',
  imageUrl: 'https://example.com/product.jpg',
  category: ProductCategories.ACCESSORIES,
  quantity: 5,
  unitPrice: 10.99,
  productId: 'product123',
};

const mockEntityManager = {
  persistAndFlush: jest.fn().mockResolvedValue(mockCartProductDto),
};

const cartRepoMock = {
  findOne: jest.fn().mockResolvedValue(mockCartProductDto),
  getEntityManager: jest.fn().mockReturnValue(mockEntityManager), //сюда надо пихать все методы
};

const productsServiceMock = {
  getProductById: jest.fn().mockReturnValue(mockProduct3[0].id),
};

const cartProductsRepoMock = {
  findOne: jest.fn().mockResolvedValue(mockCartProductDto),
  create: jest.fn().mockResolvedValue(mockCartProductDto),
};

const i18nServiceMock = {
  translate: jest.fn(),
};

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
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
          provide: I18nService,
          useValue: i18nServiceMock,
        },
      ],
    }).compile();

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
    ).rejects.toThrow(NotAcceptableException);
  });

  it('should throw NotAcceptableException when adding a product with insufficient quantity', async () => {
    const userId = v4();
    const productId = mockProduct3[0].id;
    const quantity = 10;
    const lang = 'en';

    productsServiceMock.getProductById.mockResolvedValue({ quantity: 5 });
    try {
      await cartService.addProductToCart(userId, productId, quantity, lang);
    } catch (error) {
      expect(error).toBeInstanceOf(NotAcceptableException);
    }
  });

  it('should get user cart as a CartDto', async () => {
    const userId = 'user123';

    cartRepoMock.findOne.mockResolvedValue(mockCartDto);

    const cartDto = await cartService.getUsersCart(userId);

    expect(CartDto).toBeInstanceOf(CartDto);

    expect(cartDto.id).toEqual(mockCartDto.id);
    expect(cartDto.created).toEqual(mockCartDto.created);
    expect(cartDto.updated).toEqual(mockCartDto.updated);
  });
});
