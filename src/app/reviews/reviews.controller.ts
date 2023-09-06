import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';
import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { EditReviewForm } from './dto/edit-review.form';
import { NewReviewForm } from './dto/new-review.form';
import { ReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':productId')
  async getProductReviews(@Param('productId', ParseUUIDPipe) id: string) {
    const reviews = await this.reviewsService.getProductReviews(id);
    return ReviewDto.fromEntities(reviews);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanLeaveReviews)
  @ApiBody({ type: NewReviewForm })
  @Post(':productId')
  async addProductReview(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() reviewForm: NewReviewForm,
    @CurrentUser() user: UserSessionDto,
  ) {
    const dto = NewReviewForm.from(reviewForm);
    const created = await this.reviewsService.addProductReview(
      user.id,
      productId,
      dto,
    );

    return ReviewDto.fromEntity(created);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanLeaveReviews)
  @ApiBody({ type: EditReviewForm })
  @Put(':reviewId')
  async editProductReview(
    @Param('reviewId', ParseUUIDPipe) id: string,
    @Body() reviewForm: EditReviewForm,
  ) {
    const dto = EditReviewForm.from(reviewForm);
    const edited = await this.reviewsService.editProductReview(id, dto);

    return ReviewDto.fromEntity(edited);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanLeaveReviews)
  @Delete(':reviewId')
  async deleteProductReview(
    @Param('reviewId', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserSessionDto,
    @I18nLang() lang: string,
  ) {
    const archived = await this.reviewsService.archiveProductReview(
      id,
      user.id,
      lang,
    );
    return ReviewDto.fromEntity(archived);
  }
}
