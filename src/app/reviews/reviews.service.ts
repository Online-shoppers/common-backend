import { wrap } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ProductsService } from 'app/products/products.service';
import { UserService } from 'app/user/user.service';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewRepo } from './repo/review.repo';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepo: ReviewRepo,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    private readonly i18nService: I18nService,
  ) {}

  async getProductReviews(productId: string) {
    return this.reviewsRepo.find(
      { product: { id: productId } },
      { populate: ['user'] },
    );
  }

  async getProductReviewById(id: string, lang: string) {
    try {
      const review = await this.reviewsRepo.findOneOrFail({ id });
      return review;
    } catch (err) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NotExists_Review, { lang }),
      );
    }
  }

  async addProductReview(
    userId: string,
    productId: string,
    data: NewReviewForm,
    lang: string,
  ) {
    const em = this.reviewsRepo.getEntityManager();

    const [user, product] = await Promise.all([
      this.userService.getUserById(userId),
      this.productService.getProductById(productId, lang),
    ]);

    const created = this.reviewsRepo.create({
      ...data,
      archived: false,
      edited: false,
      user,
      product,
    });

    await em.persistAndFlush(created);

    return created;
  }

  async editProductReview(id: string, data: EditReviewForm, lang: string) {
    const em = this.reviewsRepo.getEntityManager();

    const product = await this.getProductReviewById(id, lang);
    const edited = wrap(product).assign({ ...data, edited: true });

    await em.persistAndFlush(edited);

    return edited;
  }

  async archiveProductReview(reviewId: string, userId: string, lang: string) {
    const em = this.reviewsRepo.getEntityManager();

    const review = await this.getProductReviewById(reviewId, lang);
    const edited = wrap(review).assign({ archived: true });

    await em.persistAndFlush(edited);

    if (review.user.id !== userId) {
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.Delete_Reviews, {
          lang,
        }),
      );
    }

    return edited;
  }
}
