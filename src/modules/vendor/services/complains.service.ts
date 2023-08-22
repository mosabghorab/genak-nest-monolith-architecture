import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Complain } from '../../shared/entities/complain.entity';
import { CreateComplainDto } from '../dtos/create-complain.dto';
import { CreateComplainUploadedFilesDto } from '../dtos/create-complain-uploaded-files.dto';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { VendorsService } from './vendors.service';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    private readonly ordersService: OrdersService,
    private readonly vendorsService: VendorsService,
  ) {}

  // create.
  async create(
    vendorId: number,
    createComplainDto: CreateComplainDto,
    createComplainUploadedFilesDto: CreateComplainUploadedFilesDto,
  ) {
    const vendor = await this.vendorsService.findOneById(vendorId);
    const order = await this.ordersService.findOneById(
      createComplainDto.orderId,
      vendor.serviceType,
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
        complainerId: vendorId,
        complainerUserType: ClientUserType.VENDOR,
        serviceType: vendor.serviceType,
        image: createComplainUploadedFilesDto.image?.name,
        ...createComplainDto,
      }),
    );
  }
}
