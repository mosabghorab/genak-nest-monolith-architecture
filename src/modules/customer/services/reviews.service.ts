import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Helpers } from '../../../core/helpers';
import { VendorsService } from './vendors.service';
import { OrdersService } from './orders.service';
import { Review } from '../../shared/entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly ordersService: OrdersService,
    private readonly vendorsService: VendorsService,
  ) {}

  // create.
  async create(customerId: number, createReviewDto: CreateReviewDto) {
    const order = await this.ordersService.findOneById(createReviewDto.orderId);
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    const vendor = await this.vendorsService.findOneById(
      createReviewDto.vendorId,
    );
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        customerId,
        reviewedBy: ClientUserType.CUSTOMER,
        serviceType: order.serviceType,
        ...createReviewDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number, findAllReviewsDto: FindAllReviewsDto) {
    const { today, tomorrow } = Helpers.getTodayAndTomorrowForADate(
      findAllReviewsDto.date,
    );
    return this.reviewRepository.find({
      where: {
        customerId,
        serviceType: findAllReviewsDto.serviceType,
        reviewedBy: ClientUserType.CUSTOMER,
        order: {
          uniqueId: findAllReviewsDto.orderUniqueId
            ? ILike(`%${findAllReviewsDto.orderUniqueId}%`)
            : null,
          createdAt: findAllReviewsDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
