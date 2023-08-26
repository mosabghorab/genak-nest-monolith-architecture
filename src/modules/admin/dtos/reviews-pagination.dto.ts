import { Expose, Type } from 'class-transformer';
import { ReviewDto } from '../../shared/dtos/review.dto';

export class ReviewsPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => ReviewDto)
  data: ReviewDto[];
}
