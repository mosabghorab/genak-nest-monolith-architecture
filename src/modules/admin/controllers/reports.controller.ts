import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { ReportsService } from '../services/reports.service';
import { FindVendorsReportsDto } from '../dtos/find-vendors-reports.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { VendorsReportsDto } from '../dtos/vendors-reports.dto';
import { CustomersReportsDto } from '../dtos/customers-reports.dto';
import { FindSalesReportsDto } from '../dtos/find-sales-reports.dto';
import { SalesReportsDto } from '../dtos/sales-reports.dto';
import { FindSalesReportsWithFilterDto } from '../dtos/find-sales-reports-with-filter.dto';
import { SalesReportsWithFilterDto } from '../dtos/sales-reports-with-filter.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REPORTS)
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorsReportsDto, 'Vendors reports.')
  @Get('vendors-reports')
  findVendorsReports(@Query() findVendorsReportsDto: FindVendorsReportsDto) {
    return this.reportsService.findVendorsReports(findVendorsReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersReportsDto, 'Customers reports.')
  @Get('customers-reports')
  findCustomersReports() {
    return this.reportsService.findCustomersReports();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsDto, 'Sales reports.')
  @Get('sales-reports')
  findSalesReports(@Query() findSalesReportsDto: FindSalesReportsDto) {
    return this.reportsService.findSalesReports(findSalesReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsWithFilterDto, 'Sales reports with filter.')
  @Get('sales-reports-with-filter')
  findSalesReportsWithFilter(
    @Query() findSalesReportsWithFilterDto: FindSalesReportsWithFilterDto,
  ) {
    return this.reportsService.findSalesReportsWithFilter(
      findSalesReportsWithFilterDto,
    );
  }
}
