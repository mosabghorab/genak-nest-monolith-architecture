import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';
import { UpdateCustomersAddressDto } from '../dtos/update-customers-address.dto';
import { CustomerAddress } from '../entities/customer-address.entity';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  // create.
  async create(
    customerId: number,
    createCustomersAddressDto: CreateCustomerAddressDto,
  ) {
    return this.customerAddressRepository.save(
      this.customerAddressRepository.create({
        customerId,
        ...createCustomersAddressDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number) {
    return this.customerAddressRepository.find({
      where: { customerId },
    });
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<CustomerAddress>) {
    return this.customerAddressRepository.findOne({
      where: { id },
      relations,
    });
  }

  // update.
  async update(
    id: number,
    updateCustomersAddressDto: UpdateCustomersAddressDto,
  ) {
    const customerAddress = await this.findOneById(id);
    if (!customerAddress) {
      throw new NotFoundException('Customer address not found.');
    }
    Object.assign(customerAddress, updateCustomersAddressDto);
    return this.customerAddressRepository.save(customerAddress);
  }

  // remove by id.
  async removeById(id: number) {
    const customerAddress = await this.findOneById(id);
    if (!customerAddress) {
      throw new NotFoundException('Customer address not found.');
    }
    return this.customerAddressRepository.remove(customerAddress);
  }
}
