import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../shared/entities/customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { LocationsService } from './locations.service';
import { FindAllCustomersDto } from '../dtos/find-all-customers.dto';
import { Helpers } from '../../../core/helpers';

@Injectable()
export class CustomersService {
  @InjectRepository(Customer) private readonly repo: Repository<Customer>;

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

  // find all.
  async findAll(
    findAllCustomersDto: FindAllCustomersDto,
    relations?: FindOptionsRelations<Customer>,
  ) {
    const offset = (findAllCustomersDto.page - 1) * findAllCustomersDto.limit;
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    if (relations) {
      Helpers.buildRelationsForQueryBuilder<Customer>(
        queryBuilder,
        relations,
        'customer',
      );
    }
    queryBuilder.skip(offset).take(findAllCustomersDto.limit);
    const [customers, count] = await queryBuilder.getManyAndCount();
    return {
      perPage: findAllCustomersDto.limit,
      currentPage: findAllCustomersDto.page,
      lastPage: Math.ceil(count / findAllCustomersDto.limit),
      total: count,
      data: customers,
    };
  }

  // create.
  async create(createCustomerDto: CreateCustomerDto) {
    const customerByPhone = await this.findOneByPhone(createCustomerDto.phone);
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate = await this.locationsService.findOneById(
      createCustomerDto.governorateId,
    );
    if (!governorate) {
      throw new NotFoundException('Governorate not found.');
    }
    const region = await this.locationsService.findOneById(
      createCustomerDto.regionId,
    );
    if (!region) {
      throw new NotFoundException('Region not found.');
    }
    if (region.parentId !== governorate.id) {
      throw new BadRequestException(
        'The provided region is not for the provided governorate.',
      );
    }
    return await this.customerRepository.save(
      await this.customerRepository.create(createCustomerDto),
    );
  }

  // update.
  async update(customerId: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOneById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    if (updateCustomerDto.phone) {
      const customerByPhone = await this.findOneByPhone(
        updateCustomerDto.phone,
      );
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateCustomerDto.governorateId) {
      const governorate = await this.locationsService.findOneById(
        updateCustomerDto.governorateId,
      );
      if (!governorate) {
        throw new NotFoundException('Governorate not found.');
      }
      const region = await this.locationsService.findOneById(
        updateCustomerDto.regionId,
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
    Object.assign(customer, updateCustomerDto);
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
