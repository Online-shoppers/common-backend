import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { ProductEntity } from '../products/entities/product.entity';
import { ProductCategories } from '../products/enums/product-categories.enum';
import { ProductTypes } from '../products/enums/product-types.enum';
import { ProductsService } from '../products/products.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewEntity } from './entities/review.entity';
import { ReviewRepo } from './repo/review.repo';
import { ReviewsService } from './reviews.service';

const product: ProductEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  name: '123',
  price: 123,
  description: '123',
  quantity: 1,
  image_url: '231',
  category: ProductCategories.BEER,
  type: ProductTypes.BEER_COASTERS,
  cartProducts: null,
  reviews: null,
  archived: false,
  async reviewsAmount(): Promise<number> {
    return 5;
  },
  async rating(): Promise<number | number> {
    return 4.5;
  },
};
const user: UserEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  email: '123',
  firstName: '13',
  lastName: '14',
  role: null,
  refreshTokens: null,
  archived: false,
  password: '123',
  cart: null,
  orders: null,
  reviews: null,
};
const reviews: ReviewEntity[] = [
  {
    id: '1',
    updated: new Date(),
    created: new Date(),
    user: {
      id: '1',
      updated: new Date(),
      created: new Date(),
      firstName: 'John',
      lastName: 'Johny',
      password: '123',
      archived: false,
      refreshTokens: null,
      role: null,
      email: 'ttwe@mail.ru',
      cart: null,
      orders: null,
      reviews: null,
    },
    text: 'text',
    rating: 3,
    edited: false,
    archived: false,
    product: null,
  },
];
const em = {
  persistAndFlush: jest.fn(),
};
const mockReviewRepo = {
  find: jest.fn().mockResolvedValue(reviews),
  create: jest.fn().mockResolvedValue(reviews[0]),
  getEntityManager: jest.fn().mockReturnValue(em),
  findOneOrFail: jest.fn().mockResolvedValue(reviews[0]),
};

const mockUserService = {
  getUserById: jest.fn().mockResolvedValue(user),
};

const mockProductService = {
  getProductById: jest.fn().mockResolvedValue(product),
};

const mockI18n = {
  translate: jest.fn().mockReturnValue('Forbidden Message'),
};
describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepo: ReviewRepo;
  let userService: UserService;
  let productsService: ProductsService;
  let i18nService: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: ReviewRepo,
          useValue: mockReviewRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepo = module.get<ReviewRepo>(ReviewRepo);
    userService = module.get<UserService>(UserService);
    productsService = module.get<ProductsService>(ProductsService);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductReviews', () => {
    it('should return product reviews', async () => {
      const productId = '123';

      const result = await service.getProductReviews(productId);

      expect(result).toEqual(reviews);
      expect(reviewRepo.find).toHaveBeenCalledWith(
        { product: { id: productId } },
        { populate: ['user'] },
      );
    });
  });

  describe('addProductReview', () => {
    it('should add a product review', async () => {
      const userId = 'user123';

      const reviewForm: NewReviewForm = {
        text: '123',
        rating: 4,
      };

      const result = await service.addProductReview('1', '1', reviewForm, 'en');

      expect(result).toEqual(reviews[0]);

      expect(reviewRepo.getEntityManager).toHaveBeenCalled();
    });
  });

  describe('editProductReview', () => {
    it('should edit a product review', async () => {
      const reviewId = 'review123';
      const data: EditReviewForm = {
        text: 'Edited review',
        rating: 5,
        archived: false,
      };

      const result = await service.editProductReview(reviewId, data, 'en');

      expect(result).toEqual(reviews[0]);

      expect(reviewRepo.getEntityManager).toHaveBeenCalled();
    });
  });


  describe('archiveProductReview', () => {
    it('should throw ForbiddenException when user ID does not match', async () => {
      const reviewId = '1';
      const userId = '2';
      const lang = 'en';

      await expect(async () => {
        await service.archiveProductReview(reviewId, userId, lang);
      }).rejects.toThrow(ForbiddenException);
    });
  });

});
