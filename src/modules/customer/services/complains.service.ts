import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Complain } from '../../shared/entities/complain.entity';
import { CreateComplainDto } from '../dtos/create-complain.dto';
import { CreateComplainUploadedFilesDto } from '../dtos/create-complain-uploaded-files.dto';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    private readonly ordersService: OrdersService,
  ) {}

  // create.
  async create(
    customerId: number,
    createComplainDto: CreateComplainDto,
    createComplainUploadedFilesDto: CreateComplainUploadedFilesDto,
  ) {
    const order = await this.ordersService.findOneById(
      createComplainDto.orderId,
    );
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    if (createComplainUploadedFilesDto.image) {
      await Helpers.saveFile(
        Constants.complainsImagesPath,
        createComplainUploadedFilesDto.image.name,
        createComplainUploadedFilesDto.image,
      );
    }
    return this.complainRepository.save(
      await this.complainRepository.create({
        complainerId: customerId,
        complainerUserType: ClientUserType.CUSTOMER,
        image: createComplainUploadedFilesDto.image?.name,
        serviceType: order.serviceType,
        ...createComplainDto,
      }),
    );
  }
}
