import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsPaginationDto } from '../dtos/reviews-pagination.dto';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { ReviewDto } from '../../shared/dtos/review.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REVIEWS)
@Controller('admin/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReviewsPaginationDto, 'All reviews.')
  @Get()
  findAll(@Query() findAllReviewsDto: FindAllReviewsDto) {
    return this.reviewsService.findAll(findAllReviewsDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReviewDto, 'Review deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.reviewsService.remove(id);
  }
}
