import { Injectable } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';
import { LocationsService } from './locations.service';
import { FindGeneralStatisticsDto } from '../dtos/find-general-statistics.dto';
import { AdminsService } from './admins.service';

@Injectable()
export class GeneralStatisticsService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly vendorsService: VendorsService,
    private readonly adminsService: AdminsService,
    private readonly ordersService: OrdersService,
    private readonly locationsService: LocationsService,
  ) {}

  // find all.
  async findAll(findGeneralStatisticsDto: FindGeneralStatisticsDto) {
    const customersCount = await this.customersService.count();
    const adminsCount = await this.adminsService.count();
    const allVendorsCount = await this.vendorsService.count();
    const vendorsCountByServiceType = await this.vendorsService.count(
      findGeneralStatisticsDto.serviceType,
    );
    const ordersCount = await this.ordersService.count(
      findGeneralStatisticsDto.serviceType,
    );
    const governoratesWithVendorsAndCustomersAndOrdersCount =
      await this.locationsService.findGovernoratesWithVendorsAndCustomersAndOrdersCount(
        findGeneralStatisticsDto.serviceType,
      );
    const latestOrders = await this.ordersService.findLatest(
      10,
      findGeneralStatisticsDto.serviceType,
      {
        customer: true,
        vendor: true,
      },
    );
    const latestVendors = await this.vendorsService.findLatest(
      10,
      findGeneralStatisticsDto.serviceType,
    );
    return {
      usersCount: allVendorsCount + customersCount + adminsCount,
      customersCount,
      vendorsCount: vendorsCountByServiceType,
      ordersCount,
      governoratesWithVendorsAndCustomersAndOrdersCount,
      latestOrders,
      latestVendors,
    };
  }
}
