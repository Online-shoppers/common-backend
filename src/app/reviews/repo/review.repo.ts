import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewRepo extends EntityRepository<ReviewEntity> {}
