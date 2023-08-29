import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { VendorsService } from './vendors.service';
import { OrdersService } from './orders.service';
import { Review } from '../../../shared/entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { ClientUserType } from '../../../shared/enums/client-user-type.enum';
import { Order } from '../../../shared/entities/order.entity';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly ordersService: OrdersService,
    private readonly vendorsService: VendorsService,
  ) {}

  // create.
  async create(customerId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const order: Order = await this.ordersService.findOneOrFailById(createReviewDto.orderId);
    await this.vendorsService.findOneOrFailById(createReviewDto.vendorId);
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
  findAll(customerId: number, findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = DateHelpers.getTodayAndTomorrowForADate(findAllReviewsDto.date);
    return this.reviewRepository.find({
      where: {
        customerId,
        serviceType: findAllReviewsDto.serviceType,
        reviewedBy: ClientUserType.CUSTOMER,
        order: {
          uniqueId: findAllReviewsDto.orderUniqueId ? ILike(`%${findAllReviewsDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
