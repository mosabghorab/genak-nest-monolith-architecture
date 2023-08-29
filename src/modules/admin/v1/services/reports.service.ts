import { Injectable } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';
import { LocationsService } from './locations.service';
import { AdminsService } from './admins.service';
import { FindVendorsReportsDto } from '../dtos/reports/find-vendors-reports.dto';
import { VendorStatus } from '../../../vendor/enums/vendor-status.enum';
import { FindSalesReportsDto } from '../dtos/reports/find-sales-reports.dto';
import { ProductsService } from './products.service';
import { OrderItemService } from './order-item.service';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { FindSalesReportsWithFilterDto } from '../dtos/reports/find-sales-reports-with-filter.dto';
import { Location } from '../../../shared/entities/location.entity';
import { Product } from '../../../shared/entities/product.entity';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { Customer } from '../../../shared/entities/customer.entity';

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
  async findVendorsReports(findVendorsReportsDto: FindVendorsReportsDto): Promise<{
    governoratesWithVendorsCount: Location[];
    documentsRequiredVendorsCount: number;
    pendingVendorsCount: number;
    activeVendorsCount: number;
  }> {
    const documentsRequiredVendorsCount: number = await this.vendorsService.count(findVendorsReportsDto.serviceType, VendorStatus.DOCUMENTS_REQUIRED);
    const pendingVendorsCount: number = await this.vendorsService.count(findVendorsReportsDto.serviceType, VendorStatus.PENDING);
    const activeVendorsCount: number = await this.vendorsService.count(findVendorsReportsDto.serviceType, VendorStatus.ACTIVE);
    const governoratesWithVendorsCount: Location[] = await this.locationsService.findGovernoratesWithVendorsCount(findVendorsReportsDto.serviceType);
    return {
      documentsRequiredVendorsCount,
      pendingVendorsCount,
      activeVendorsCount,
      governoratesWithVendorsCount,
    };
  }

  // find customers reports.
  async findCustomersReports(): Promise<{ customersCount: number; governoratesWithCustomersCount: Location[] }> {
    const customersCount: number = await this.customersService.count();
    const governoratesWithCustomersCount: Location[] = await this.locationsService.findGovernoratesWithCustomersCount();
    return {
      customersCount,
      governoratesWithCustomersCount,
    };
  }

  // find sales reports.
  async findSalesReports(findSalesReportsDto: FindSalesReportsDto): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    totalSales: number;
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    const ordersCount: number = await this.ordersService.count(findSalesReportsDto.serviceType);
    const totalSales: number = parseFloat((await this.ordersService.totalSales(findSalesReportsDto.serviceType)).totalSales) || 0;
    const governoratesWithOrdersCount: Location[] = await this.locationsService.findGovernoratesWithOrdersCount(findSalesReportsDto.serviceType);
    const productsWithTotalSales: Product[] = await this.productsService.findWithTotalSales(findSalesReportsDto.serviceType);
    let customOrderItemsTotalSales: number;
    let customOrderItemsTotalQuantities: number;
    if (findSalesReportsDto.serviceType === ServiceType.WATER) {
      const {
        totalSales,
        totalQuantities,
      }: {
        totalSales: string;
        totalQuantities: string;
      } = await this.orderItemService.findCustomOrderItemsTotalSalesAndQuantities();
      customOrderItemsTotalSales = parseFloat(totalSales) || 0;
      customOrderItemsTotalQuantities = parseInt(totalQuantities) || 0;
    }
    return {
      ordersCount,
      totalSales,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
    };
  }

  // find sales reports with filter.
  async findSalesReportsWithFilter(findSalesReportsWithFilterDto: FindSalesReportsWithFilterDto): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    vendorsBestSellersWithOrdersCount: Vendor[];
    customersBestBuyersWithOrdersCount: Customer[];
    productsWithOrdersCount: Product[];
    totalSales: number;
    regionsWithOrdersCount: Location[];
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    const ordersCount: number = await this.ordersService.count(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );
    const totalSales: number =
      parseFloat(
        (
          await this.ordersService.totalSales(
            findSalesReportsWithFilterDto.serviceType,
            findSalesReportsWithFilterDto.dateFilterOption,
            findSalesReportsWithFilterDto.startDate,
            findSalesReportsWithFilterDto.endDate,
          )
        ).totalSales,
      ) || 0;

    const governoratesWithOrdersCount: Location[] = await this.locationsService.findGovernoratesWithOrdersCount(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );

    const regionsWithOrdersCount: Location[] = await this.locationsService.findRegionsWithOrdersCount(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );

    const productsWithTotalSales: Product[] = await this.productsService.findWithTotalSales(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );
    const productsWithOrdersCount: Product[] = await this.productsService.findWithOrdersCount(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );

    const vendorsBestSellersWithOrdersCount: Vendor[] = await this.vendorsService.findBestSellersWithOrdersCount(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );

    const customersBestBuyersWithOrdersCount: Customer[] = await this.customersService.findBestBuyersWithOrdersCount(
      findSalesReportsWithFilterDto.serviceType,
      findSalesReportsWithFilterDto.dateFilterOption,
      findSalesReportsWithFilterDto.startDate,
      findSalesReportsWithFilterDto.endDate,
    );
    let customOrderItemsTotalSales: number;
    let customOrderItemsTotalQuantities: number;
    if (findSalesReportsWithFilterDto.serviceType === ServiceType.WATER) {
      const {
        totalSales,
        totalQuantities,
      }: {
        totalSales: string;
        totalQuantities: string;
      } = await this.orderItemService.findCustomOrderItemsTotalSalesAndQuantities(
        findSalesReportsWithFilterDto.dateFilterOption,
        findSalesReportsWithFilterDto.startDate,
        findSalesReportsWithFilterDto.endDate,
      );
      customOrderItemsTotalSales = parseFloat(totalSales) || 0;
      customOrderItemsTotalQuantities = parseInt(totalQuantities) || 0;
    }
    return {
      ordersCount,
      totalSales,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
      regionsWithOrdersCount,
      productsWithOrdersCount,
      vendorsBestSellersWithOrdersCount,
      customersBestBuyersWithOrdersCount,
    };
  }
}
