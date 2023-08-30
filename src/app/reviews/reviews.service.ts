import { ForbiddenException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewRepo } from './repo/review.repo';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepo: ReviewRepo,
    private readonly i18nService: I18nService,
  ) {}

  async getProductReviews(productId: string) {
    return this.reviewsRepo.getProductReviews(productId);
  }

  async addProductReview(
    userId: string,
    productId: string,
    data: NewReviewForm,
  ) {
    return this.reviewsRepo.addProductReview(userId, productId, data);
  }

  async editProductReview(id: string, data: EditReviewForm) {
    return this.reviewsRepo.editProductReview(id, data);
  }

  async archiveProductReview(reviewId: string, userId: string) {
    const exists = await this.reviewsRepo.getProductReviewById(reviewId);

    if (exists.user.id !== userId) {
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.Delete_Reviews),
      );
    }

    return this.reviewsRepo.archiveProductReview(reviewId);
  }
}
