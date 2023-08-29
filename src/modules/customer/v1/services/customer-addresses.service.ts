import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../dtos/update-customer-address.dto';
import { CustomerAddress } from '../../entities/customer-address.entity';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  // create.
  create(customerId: number, createCustomersAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    return this.customerAddressRepository.save(
      this.customerAddressRepository.create({
        customerId,
        ...createCustomersAddressDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number): Promise<CustomerAddress[]> {
    return this.customerAddressRepository.find({
      where: { customerId },
    });
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(id, relations);
    if (!customerAddress) {
      throw new NotFoundException(failureMessage || 'Customer address not found.');
    }
    return customerAddress;
  }

  // update.
  async update(id: number, updateCustomersAddressDto: UpdateCustomerAddressDto): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(id);
    Object.assign(customerAddress, updateCustomersAddressDto);
    return this.customerAddressRepository.save(customerAddress);
  }

  // remove.
  async remove(id: number): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(id);
    return this.customerAddressRepository.remove(customerAddress);
  }
}
