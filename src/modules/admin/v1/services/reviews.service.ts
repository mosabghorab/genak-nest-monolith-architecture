import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { Review } from '../../../shared/entities/review.entity';
import { FindAllReviewsDto } from '../dtos/reviews/find-all-reviews.dto';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Review>): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Review>): Promise<Review> {
    const review: Review = await this.findOneById(id, relations);
    if (!review) {
      throw new NotFoundException(failureMessage || 'Review not found.');
    }
    return review;
  }

  // find all.
  async findAll(findAllReviewsDto: FindAllReviewsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Review[];
    currentPage: number;
  }> {
    const offset: number = (findAllReviewsDto.page - 1) * findAllReviewsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllReviewsDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllReviewsDto.startDate,
        endDate: findAllReviewsDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllReviewsDto.dateFilterOption);
    }
    const [reviews, count]: [Review[], number] = await this.reviewRepository.findAndCount({
      where: {
        customerId: findAllReviewsDto.customerId,
        vendorId: findAllReviewsDto.vendorId,
        serviceType: findAllReviewsDto.serviceType,
        reviewedBy: findAllReviewsDto.reviewedBy,
        createdAt: Between(dateRange.startDate, dateRange.endDate),
      },
      relations: {
        customer: true,
        vendor: true,
        order: true,
      },
      skip: offset,
      take: findAllReviewsDto.limit,
    });
    return {
      perPage: findAllReviewsDto.limit,
      currentPage: findAllReviewsDto.page,
      lastPage: Math.ceil(count / findAllReviewsDto.limit),
      total: count,
      data: reviews,
    };
  }

  // remove.
  async remove(id: number): Promise<Review> {
    const review: Review = await this.findOneOrFailById(id);
    return this.reviewRepository.remove(review);
  }
}
