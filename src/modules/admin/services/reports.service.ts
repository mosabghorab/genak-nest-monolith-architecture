import { Injectable } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';
import { LocationsService } from './locations.service';
import { AdminsService } from './admins.service';
import { FindVendorsReportsDto } from '../dtos/find-vendors-reports.dto';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';
import { FindSalesReportsDto } from '../dtos/find-sales-reports.dto';
import { ProductsService } from './products.service';
import { OrderItemService } from './order-item.service';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { FindSalesReportsWithFilterDto } from '../dtos/find-sales-reports-with-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly vendorsService: VendorsService,
    private readonly adminsService: AdminsService,
    private readonly ordersService: OrdersService,
    private readonly locationsService: LocationsService,
    private readonly productsService: ProductsService,
    private readonly orderItemService: OrderItemService,
  ) {}

  // find vendors reports.
  async findVendorsReports(findVendorsReportsDto: FindVendorsReportsDto) {
    const documentsRequiredVendorsCount = await this.vendorsService.count(
      findVendorsReportsDto.serviceType,
      VendorStatus.DOCUMENTS_REQUIRED,
    );
    const pendingVendorsCount = await this.vendorsService.count(
      findVendorsReportsDto.serviceType,
      VendorStatus.PENDING,
    );
    const activeVendorsCount = await this.vendorsService.count(
      findVendorsReportsDto.serviceType,
      VendorStatus.ACTIVE,
    );
    const governoratesWithVendorsCount =
      await this.locationsService.findGovernoratesWithVendorsCount(
        findVendorsReportsDto.serviceType,
      );
    return {
      documentsRequiredVendorsCount,
      pendingVendorsCount,
      activeVendorsCount,
      governoratesWithVendorsCount,
    };
  }

  // find customers reports.
  async findCustomersReports() {
    const customersCount = await this.customersService.count();
    const governoratesWithCustomersCount =
      await this.locationsService.findGovernoratesWithCustomersCount();
    return {
      customersCount,
      governoratesWithCustomersCount,
    };
  }

  // find sales reports.
  async findSalesReports(findSalesReportsDto: FindSalesReportsDto) {
    const ordersCount = await this.ordersService.count(
      findSalesReportsDto.serviceType,
    );
    const { totalSales } = await this.ordersService.totalSales(
      findSalesReportsDto.serviceType,
    );
    const governoratesWithOrdersCount =
      await this.locationsService.findGovernoratesWithOrdersCount(
        findSalesReportsDto.serviceType,
      );

    const productsWithTotalSales =
      await this.productsService.findProductsWithTotalSales(
        findSalesReportsDto.serviceType,
      );
    const { customOrderItemsTotalSales, customOrderItemsTotalQuantities } =
      findSalesReportsDto.serviceType == ServiceType.WATER
        ? await this.orderItemService.findCustomOrderItemsTotalSalesAndQuantities(
            findSalesReportsDto.serviceType,
          )
        : {
            customOrderItemsTotalSales: null,
            customOrderItemsTotalQuantities: null,
          };
    return {
      ordersCount,
      totalSales: totalSales || 0,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
    };
  }

  // find sales reports with filter.
  async findSalesReportsWithFilter(
    findSalesReportsWithFilterDto: FindSalesReportsWithFilterDto,
  ) {
    const ordersCount = await this.ordersService.count(
      findSalesReportsWithFilterDto.serviceType,
    );
    const { totalSales } = await this.ordersService.totalSales(
      findSalesReportsWithFilterDto.serviceType,
    );
    const governoratesWithOrdersCount =
      await this.locationsService.findGovernoratesWithOrdersCount(
        findSalesReportsWithFilterDto.serviceType,
      );

    const regionsWithOrdersCount =
      await this.locationsService.findRegionsWithOrdersCount(
        findSalesReportsWithFilterDto.serviceType,
      );

    const productsWithTotalSales =
      await this.productsService.findProductsWithTotalSales(
        findSalesReportsWithFilterDto.serviceType,
      );
    const productsWithOrdersCount =
      await this.productsService.findProductsWithOrdersCount(
        findSalesReportsWithFilterDto.serviceType,
      );

    const vendorsBestSellerWithOrdersCount =
      await this.vendorsService.findVendorsBestSellerWithOrdersCount(
        findSalesReportsWithFilterDto.serviceType,
      );

    const customersBestBuyerWithOrdersCount =
      await this.customersService.findCustomersBestBuyerWithOrdersCount(
        findSalesReportsWithFilterDto.serviceType,
        findSalesReportsWithFilterDto.dateFilterOption,
        findSalesReportsWithFilterDto.startDate,
        findSalesReportsWithFilterDto.endDate,
      );
    const { customOrderItemsTotalSales, customOrderItemsTotalQuantities } =
      findSalesReportsWithFilterDto.serviceType == ServiceType.WATER
        ? await this.orderItemService.findCustomOrderItemsTotalSalesAndQuantities(
            findSalesReportsWithFilterDto.serviceType,
          )
        : {
            customOrderItemsTotalSales: null,
            customOrderItemsTotalQuantities: null,
          };
    return {
      ordersCount,
      totalSales: totalSales || 0,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
      regionsWithOrdersCount,
      productsWithOrdersCount,
      vendorsBestSellerWithOrdersCount,
      customersBestBuyerWithOrdersCount,
    };
  }
}
