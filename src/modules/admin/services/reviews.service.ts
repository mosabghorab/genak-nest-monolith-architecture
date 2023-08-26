import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { Helpers } from '../../../core/helpers';
import { DateFilterOption } from '../enums/date-filter-options.enum';
import { Review } from '../../shared/entities/review.entity';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Review>) {
    return this.reviewRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(findAllReviewsDto: FindAllReviewsDto) {
    const offset = (findAllReviewsDto.page - 1) * findAllReviewsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllReviewsDto.dateFilterOption) {
      if (findAllReviewsDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllReviewsDto.startDate,
          endDate: findAllReviewsDto.endDate,
        };
      } else {
        dateRange = Helpers.getDateRangeForFilterOption(
          findAllReviewsDto.dateFilterOption,
        );
      }
    }
    const [reviews, count] = await this.reviewRepository.findAndCount({
      where: {
        customerId: findAllReviewsDto.customerId,
        vendorId: findAllReviewsDto.vendorId,
        serviceType: findAllReviewsDto.serviceType,
        reviewedBy: findAllReviewsDto.reviewedBy,
        createdAt: dateRange
          ? Between(dateRange.startDate, dateRange.endDate)
          : null,
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
  async remove(id: number) {
    const review = await this.findOneById(id);
    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return this.reviewRepository.remove(review);
  }
}
