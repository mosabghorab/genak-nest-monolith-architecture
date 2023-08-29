import { Injectable } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';
import { LocationsService } from './locations.service';
import { FindGeneralStatisticsDto } from '../dtos/general-statistics/find-general-statistics.dto';
import { AdminsService } from './admins.service';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { Order } from '../../../shared/entities/order.entity';
import { Location } from '../../../shared/entities/location.entity';

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
  async findAll(findGeneralStatisticsDto: FindGeneralStatisticsDto): Promise<{
    latestVendors: Vendor[];
    ordersCount: number;
    governoratesWithVendorsAndCustomersAndOrdersCount: Location[];
    latestOrders: Order[];
    customersCount: number;
    vendorsCount: number;
    usersCount: number;
  }> {
    const customersCount: number = await this.customersService.count();
    const adminsCount: number = await this.adminsService.count();
    const allVendorsCount: number = await this.vendorsService.count();
    const vendorsCountByServiceType: number = await this.vendorsService.count(findGeneralStatisticsDto.serviceType);
    const ordersCount: number = await this.ordersService.count(findGeneralStatisticsDto.serviceType);
    const governoratesWithVendorsAndCustomersAndOrdersCount: Location[] = await this.locationsService.findGovernoratesWithVendorsAndCustomersAndOrdersCount(findGeneralStatisticsDto.serviceType);
    const latestOrders: Order[] = await this.ordersService.findLatest(10, findGeneralStatisticsDto.serviceType, {
      customer: true,
      vendor: true,
    });
    const latestVendors: Vendor[] = await this.vendorsService.findLatest(10, findGeneralStatisticsDto.serviceType);
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
