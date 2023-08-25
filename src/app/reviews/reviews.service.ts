import { ForbiddenException, Injectable } from '@nestjs/common';

import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewRepo } from './repo/review.repo';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepo: ReviewRepo) {}

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
      throw new ForbiddenException('You can not delete other reviews');
    }

    return this.reviewsRepo.archiveProductReview(reviewId);
  }
}
