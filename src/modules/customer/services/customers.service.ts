import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../shared/entities/customer.entity';
import { LocationsService } from '../../shared/services/locations.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly locationsService: LocationsService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Customer>) {
    return this.customerRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one by phone.
  findOneByPhone(phone: string, relations?: FindOptionsRelations<Customer>) {
    return this.customerRepository.findOne({
      where: { phone },
      relations,
    });
  }

  // create.
  async create(signUpDto: SignUpDto) {
    const customerByPhone = await this.findOneByPhone(signUpDto.phone);
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate = await this.locationsService.findOneById(
      signUpDto.governorateId,
    );
    if (!governorate) {
      throw new NotFoundException('Governorate not found.');
    }
    const region = await this.locationsService.findOneById(signUpDto.regionId);
    if (!region) {
      throw new NotFoundException('Region not found.');
    }
    if (region.parentId !== governorate.id) {
      throw new BadRequestException(
        'The provided region is not for the provided governorate.',
      );
    }
    return await this.customerRepository.save(
      await this.customerRepository.create(signUpDto),
    );
  }

  // update.
  async update(customerId: number, updateProfileDto: UpdateProfileDto) {
    const customer = await this.findOneById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    if (updateProfileDto.phone) {
      const customerByPhone = await this.findOneByPhone(updateProfileDto.phone);
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateProfileDto.governorateId) {
      const governorate = await this.locationsService.findOneById(
        updateProfileDto.governorateId,
      );
      if (!governorate) {
        throw new NotFoundException('Governorate not found.');
      }
      const region = await this.locationsService.findOneById(
        updateProfileDto.regionId,
      );
      if (!region) {
        throw new NotFoundException('Region not found.');
      }
      if (region.parentId !== governorate.id) {
        throw new BadRequestException(
          'The provided region is not for the provided governorate.',
        );
      }
    }
    Object.assign(customer, updateProfileDto);
    return this.customerRepository.save(customer);
  }

  // remove.
  async remove(id: number) {
    const customer = await this.findOneById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    return this.customerRepository.remove(customer);
  }
}
