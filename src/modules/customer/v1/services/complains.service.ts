import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Complain } from '../../../shared/entities/complain.entity';
import { CreateComplainDto } from '../dtos/create-complain.dto';
import { CreateComplainUploadedFilesDto } from '../dtos/create-complain-uploaded-files.dto';
import { Helpers } from '../../../../core/helpers/helpers';
import { Constants } from '../../../../core/constants';
import { ClientUserType } from '../../../shared/enums/client-user-type.enum';
import { Order } from '../../../shared/entities/order.entity';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    private readonly ordersService: OrdersService,
  ) {}

  // create.
  async create(customerId: number, createComplainDto: CreateComplainDto, createComplainUploadedFilesDto: CreateComplainUploadedFilesDto): Promise<Complain> {
    const order: Order = await this.ordersService.findOneOrFailById(createComplainDto.orderId);
    if (createComplainUploadedFilesDto.image) {
      await Helpers.saveFile(Constants.complainsImagesPath, createComplainUploadedFilesDto.image.name, createComplainUploadedFilesDto.image);
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
