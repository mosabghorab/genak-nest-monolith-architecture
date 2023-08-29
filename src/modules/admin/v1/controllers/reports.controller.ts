import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { ReportsService } from '../services/reports.service';
import { FindVendorsReportsDto } from '../dtos/reports/find-vendors-reports.dto';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { VendorsReportsDto } from '../dtos/reports/vendors-reports.dto';
import { CustomersReportsDto } from '../dtos/reports/customers-reports.dto';
import { FindSalesReportsDto } from '../dtos/reports/find-sales-reports.dto';
import { SalesReportsDto } from '../dtos/reports/sales-reports.dto';
import { FindSalesReportsWithFilterDto } from '../dtos/reports/find-sales-reports-with-filter.dto';
import { SalesReportsWithFilterDto } from '../dtos/reports/sales-reports-with-filter.dto';
import { Location } from '../../../shared/entities/location.entity';
import { Product } from '../../../shared/entities/product.entity';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { Customer } from '../../../shared/entities/customer.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REPORTS)
@Controller({ path: 'admin/reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorsReportsDto, 'Vendors reports.')
  @Get('vendors-reports')
  findVendorsReports(@Query() findVendorsReportsDto: FindVendorsReportsDto): Promise<{
    governoratesWithVendorsCount: Location[];
    documentsRequiredVendorsCount: number;
    pendingVendorsCount: number;
    activeVendorsCount: number;
  }> {
    return this.reportsService.findVendorsReports(findVendorsReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersReportsDto, 'Customers reports.')
  @Get('customers-reports')
  findCustomersReports(): Promise<{ customersCount: number; governoratesWithCustomersCount: Location[] }> {
    return this.reportsService.findCustomersReports();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsDto, 'Sales reports.')
  @Get('sales-reports')
  findSalesReports(@Query() findSalesReportsDto: FindSalesReportsDto): Promise<{
    customOrderItemsTotalQuantities: string;
    ordersCount: number;
    totalSales: string | number;
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: string;
  }> {
    return this.reportsService.findSalesReports(findSalesReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsWithFilterDto, 'Sales reports with filter.')
  @Get('sales-reports-with-filter')
  findSalesReportsWithFilter(@Query() findSalesReportsWithFilterDto: FindSalesReportsWithFilterDto): Promise<{
    customOrderItemsTotalQuantities: string | number;
    ordersCount: number;
    vendorsBestSellersWithOrdersCount: Vendor[];
    customersBestBuyersWithOrdersCount: Customer[];
    productsWithOrdersCount: Product[];
    totalSales: string | number;
    regionsWithOrdersCount: Location[];
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: string | number;
  }> {
    return this.reportsService.findSalesReportsWithFilter(findSalesReportsWithFilterDto);
  }
}
