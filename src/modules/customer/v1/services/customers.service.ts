import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Customer } from '../../../shared/entities/customer.entity';
import { LocationsService } from '../../../shared/v1/services/locations.service';
import { CustomersValidation } from '../validations/customers.validation';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class CustomersService {
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

  // create.
  async create(signUpDto: SignUpDto): Promise<Customer> {
    await this.customersValidation.validateCreation(signUpDto);
    return await this.customerRepository.save(await this.customerRepository.create(signUpDto));
  }

  // update.
  async update(customerId: number, updateProfileDto: UpdateProfileDto): Promise<Customer> {
    const customer: Customer = await this.customersValidation.validateUpdate(customerId, updateProfileDto);
    Object.assign(customer, updateProfileDto);
    return this.customerRepository.save(customer);
  }

  // remove.
  async remove(id: number): Promise<Customer> {
    const customer: Customer = await this.findOneOrFailById(id);
    return this.customerRepository.remove(customer);
  }
}
