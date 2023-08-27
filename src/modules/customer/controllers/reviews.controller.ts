import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { ReviewsService } from '../services/reviews.service';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UserType } from '../../shared/enums/user-type.enum';
import { ReviewDto } from '../../shared/dtos/review.dto';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Serialize(ReviewDto, 'Review created successfully.')
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(authedUser.id, createReviewDto);
  }

  @Serialize(ReviewDto, 'All reviews.')
  @Get()
  findAll(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findAllReviewsDto: FindAllReviewsDto,
  ) {
    return this.reviewsService.findAll(authedUser.id, findAllReviewsDto);
  }
}
