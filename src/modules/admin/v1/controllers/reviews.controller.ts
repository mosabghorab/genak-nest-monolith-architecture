import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsPaginationDto } from '../dtos/reviews/reviews-pagination.dto';
import { FindAllReviewsDto } from '../dtos/reviews/find-all-reviews.dto';
import { ReviewDto } from '../../../shared/v1/dtos/review.dto';
import { Review } from '../../../shared/entities/review.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REVIEWS)
@Controller({ path: 'admin/reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReviewsPaginationDto, 'All reviews.')
  @Get()
  findAll(@Query() findAllReviewsDto: FindAllReviewsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Review[];
    currentPage: number;
  }> {
    return this.reviewsService.findAll(findAllReviewsDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReviewDto, 'Review deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.remove(id);
  }
}
