import { wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductRepo } from 'app/products/repo/product.repo';
import { UserRepo } from 'app/user/repos/user.repo';

import { EditReviewForm } from '../dto/edit-review.form';
import { NewReviewForm } from '../dto/new-review.form';
import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewRepo extends EntityRepository<ReviewEntity> {
  constructor(
    private readonly manager: EntityManager,
    private readonly userRepository: UserRepo,
    private readonly productRepository: ProductRepo,
  ) {
    super(manager, ReviewEntity);
  }

  async getProductReviewById(id: string) {
    try {
      const review = await this.findOneOrFail({ id });
      return review;
    } catch (err) {
      throw new BadRequestException('Review does not exist');
    }
  }

  async getProductReviews(productId: string) {
    return this.find({ product: { id: productId } }, { populate: ['user'] });
  }

  async addProductReview(
    userId: string,
    productId: string,
    data: NewReviewForm,
  ) {
    const [user, product] = await Promise.all([
      this.userRepository.getById(userId),
      this.productRepository.getProductById(productId),
    ]);

    const created = this.create({
      ...data,
      archived: false,
      edited: false,
      user,
      product,
    });

    try {
      await this.manager.persistAndFlush(created);
    } catch (err) {
      throw new BadRequestException('Bad values');
    }

    return created;
  }

  async editProductReview(id: string, data: EditReviewForm) {
    const em = this.getEntityManager();

    const product = await this.getProductReviewById(id);
    const edited = wrap(product).assign({ id: 'hello', edited: true });

    await em.persistAndFlush(edited);

    return edited;
  }

  async archiveProductReview(reviewId: string) {
    const em = this.getEntityManager();

    const product = await this.getProductReviewById(reviewId);
    const edited = wrap(product).assign({ archived: true });

    await em.persistAndFlush(edited);

    return edited;
  }
}
