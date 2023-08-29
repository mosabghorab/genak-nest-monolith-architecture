import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Helpers } from '../../../../core/helpers';
import { OrdersService } from './orders.service';
import { Review } from '../../../shared/entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { CustomersService } from './customers.service';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { VendorsService } from './vendors.service';
import { ClientUserType } from '../../../shared/enums/client-user-type.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly ordersService: OrdersService,
    private readonly vendorsService: VendorsService,
    private readonly customersService: CustomersService,
  ) {}

  // create.
  async create(vendorId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const vendor = await this.vendorsService.findOneOrFailById(vendorId);
    await this.ordersService.findOneOrFailById(createReviewDto.orderId, vendor.serviceType);
    await this.customersService.findOneOrFailById(createReviewDto.customerId);
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        vendorId,
        reviewedBy: ClientUserType.VENDOR,
        serviceType: vendor.serviceType,
        ...createReviewDto,
      }),
    );
  }

  // find all.
  async findAll(vendorId: number, findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = Helpers.getTodayAndTomorrowForADate(findAllReviewsDto.date);
    const vendor = await this.vendorsService.findOneOrFailById(vendorId);
    return this.reviewRepository.find({
      where: {
        vendorId,
        serviceType: vendor.serviceType,
        reviewedBy: ClientUserType.VENDOR,
        order: {
          uniqueId: findAllReviewsDto.orderUniqueId ? ILike(`%${findAllReviewsDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
