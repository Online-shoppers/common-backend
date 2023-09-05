import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { UserSessionDto } from '../security/dto/user-session.dto';
import { JwtPermissionsGuard } from '../security/guards/jwt-permission.guard';
import { UserPermissions } from '../user-roles/enums/user-permissions.enum';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserService } from '../user/user.service';
import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewDto } from './dto/review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

const mockReviewsService = {
  getProductReviews: jest.fn(),
  addProductReview: jest.fn(),
  editProductReview: jest.fn(),
  archiveProductReview: jest.fn(),
};
describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        ReviewsService,
        {
          provide: I18nService,
          useValue: { t: jest.fn(() => 'some value') },
        },
        {
          provide: JwtPermissionsGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(ReviewsService)
      .useValue(mockReviewsService)
      .compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProductReviews', () => {
    it('should return product reviews', async () => {
      const productId = 'someProductId';
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
      mockReviewsService.getProductReviews.mockResolvedValue(reviews);

      const result = await controller.getProductReviews(productId);

      expect(result).toEqual(ReviewDto.fromEntities(reviews));
    });
  });

  describe('addProductReview', () => {
    it('should add a new product review', async () => {
      const productId = 'someProductId';
      const user: UserSessionDto = {
        id: '1',
        email: 'y.y.37@mail.ru',
        role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
        role_type: UserRoles.Client,
        permissions: [UserPermissions.All],
      };
      const reviewForm: NewReviewForm = {
        text: '123',
        rating: 4,
      };
      const createdReview: ReviewEntity = {
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
      };

      mockReviewsService.addProductReview.mockResolvedValue(createdReview);

      const result = await controller.addProductReview(
        productId,
        reviewForm,
        user,
      );

      expect(result).toEqual(ReviewDto.fromEntity(createdReview));
    });
  });

  describe('editProductReview', () => {
    it('should return edited review', async () => {
      const productId = 'someProductId';
      const editRev: EditReviewForm = {
        text: '123',
        rating: 4,
        archived: false,
      };
      const createdReview: ReviewEntity = {
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
      };

      mockReviewsService.editProductReview.mockResolvedValue(createdReview);

      const result = await controller.editProductReview('1', editRev);

      expect(result).toEqual(ReviewDto.fromEntity(createdReview));
    });
  });

  describe('deleteProductReview', () => {
    it('should return edited review', async () => {
      const productId = 'someProductId';
      const user: UserSessionDto = {
        id: '1',
        email: 'y.y.37@mail.ru',
        role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
        role_type: UserRoles.Client,
        permissions: [UserPermissions.All],
      };
      const createdReview: ReviewEntity = {
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
        archived: true,
        product: null,
      };

      mockReviewsService.archiveProductReview.mockResolvedValue(createdReview);

      const result = await controller.deleteProductReview('1', user);

      expect(result).toEqual(ReviewDto.fromEntity(createdReview));
    });
  });
});
