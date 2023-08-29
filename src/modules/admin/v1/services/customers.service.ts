import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../../shared/entities/customer.entity';
import { CreateCustomerDto } from '../dtos/customers/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customers/update-customer.dto';
import { LocationsService } from './locations.service';
import { FindAllCustomersDto } from '../dtos/customers/find-all-customers.dto';
import { Helpers } from '../../../../core/helpers';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { CustomersValidation } from '../validations/customers.validation';
import { OrderByType } from '../../../shared/enums/order-by-type.enum';

@Injectable()
export class CustomersService {
  @InjectRepository(Customer) private readonly repo: Repository<Customer>;

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly locationsService: LocationsService,
    @Inject(forwardRef(() => CustomersValidation))
    private readonly customersValidation: CustomersValidation,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(id, relations);
    if (!customer) {
      throw new NotFoundException(failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(phone: string, relations?: FindOptionsRelations<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone },
      relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(phone: string, failureMessage?: string, relations?: FindOptionsRelations<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneByPhone(phone, relations);
    if (!customer) {
      throw new NotFoundException(failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find all.
  async findAll(findAllCustomersDto: FindAllCustomersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Customer[];
    currentPage: number;
  }> {
    const offset: number = (findAllCustomersDto.page - 1) * findAllCustomersDto.limit;
    const queryBuilder: SelectQueryBuilder<Customer> = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.governorate', 'governorate')
      .leftJoinAndSelect('customer.region', 'region')
      .leftJoin('customer.orders', 'order')
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .groupBy('customer.id')
      .skip(offset)
      .take(findAllCustomersDto.limit);
    const { entities, raw }: { entities: Customer[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = raw[i]['ordersCount'];
    }
    return {
      perPage: findAllCustomersDto.limit,
      currentPage: findAllCustomersDto.page,
      lastPage: Math.ceil(count / findAllCustomersDto.limit),
      total: count,
      data: entities,
    };
  }

  // create.
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    await this.customersValidation.validateCreation(createCustomerDto);
    return await this.customerRepository.save(await this.customerRepository.create(createCustomerDto));
  }

  // update.
  async update(customerId: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer: Customer = await this.customersValidation.validateUpdate(customerId, updateCustomerDto);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  // remove.
  async remove(id: number): Promise<Customer> {
    const customer: Customer = await this.findOneOrFailById(id);
    return this.customerRepository.remove(customer);
  }

  // count.
  count(): Promise<number> {
    return this.customerRepository.count();
  }

  // find best buyers with orders count.
  async findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterOption: DateFilterOption, startDate: Date, endDate: Date): Promise<Customer[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = Helpers.getDateRangeForFilterOption(dateFilterOption);
    }
    const { entities, raw }: { entities: Customer[]; raw: any[] } = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.orders', 'order', 'order.serviceType = :serviceType AND order.createdAt BETWEEN :startDate AND :endDate', {
        serviceType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .groupBy('customer.id')
      .having('ordersCount > 0')
      .orderBy('ordersCount', OrderByType.DESC)
      .limit(5)
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = raw[i]['ordersCount'];
    }
    return entities;
  }
}
