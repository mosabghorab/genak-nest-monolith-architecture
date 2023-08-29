import { Module } from '@nestjs/common';
import { AuthService } from './v1/services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Customer } from '../shared/entities/customer.entity';
import { AuthController } from './v1/controllers/auth.controller';
import { CustomersController } from './v1/controllers/customers.controller';
import { CustomersService } from './v1/services/customers.service';
import { AdminsService } from './v1/services/admins.service';
import { AdminsRolesService } from './v1/services/admins-roles.service';
import { RolesService } from './v1/services/roles.service';
import { Role } from './entities/role.entity';
import { AdminsRoles } from './entities/admins-roles.entity';
import { RolesPermissions } from './entities/roles-permissions.entity';
import { Permission } from './entities/permission';
import { RolesPermissionsService } from './v1/services/roles-permissions.service';
import { RolesController } from './v1/controllers/roles.controller';
import { ReasonsService } from './v1/services/reasons.service';
import { ReasonsController } from './v1/controllers/reasons.controller';
import { Reason } from '../shared/entities/reason.entity';
import { Location } from '../shared/entities/location.entity';
import { LocationsController } from './v1/controllers/locations.controller';
import { LocationsService } from './v1/services/locations.service';
import { ProductsController } from './v1/controllers/products.controller';
import { ProductsService } from './v1/services/products.service';
import { Product } from '../shared/entities/product.entity';
import { Vendor } from '../shared/entities/vendor.entity';
import { VendorsService } from './v1/services/vendors.service';
import { DocumentsService } from './v1/services/documents.service';
import { Document } from '../shared/entities/document.entity';
import { Attachment } from '../shared/entities/attachment.entity';
import { AttachmentsService } from './v1/services/attachments.service';
import { VendorsController } from './v1/controllers/vendors.controller';
import { LocationsVendorsService } from './v1/services/locations-vendors.service';
import { LocationVendor } from '../shared/entities/location-vendor.entity';
import { AdminsController } from './v1/controllers/admins.controller';
import { DocumentsController } from './v1/controllers/documents.controller';
import { OnBoardingScreen } from '../shared/entities/on-boarding-screen.entity';
import { OnBoardingScreensController } from './v1/controllers/on-boarding-screens.controller';
import { OnBoardingScreensService } from './v1/services/on-boarding-screens.service';
import { ProfileController } from './v1/controllers/profile.controller';
import { ProfileService } from './v1/services/profile.service';
import { ComplainsService } from './v1/services/complains.service';
import { ComplainsController } from './v1/controllers/complains.controller';
import { Complain } from '../shared/entities/complain.entity';
import { OrdersService } from './v1/services/orders.service';
import { OrdersController } from './v1/controllers/orders.controller';
import { Order } from '../shared/entities/order.entity';
import { Setting } from '../shared/entities/setting.entity';
import { SettingsController } from './v1/controllers/settings.controller';
import { SettingsService } from './v1/services/settings.service';
import { GeneralStatisticsController } from './v1/controllers/general-statistics.controller';
import { GeneralStatisticsService } from './v1/services/general-statistics.service';
import { ReportsService } from './v1/services/reports.service';
import { ReportsController } from './v1/controllers/reports.controller';
import { OrderItemService } from './v1/services/order-item.service';
import { OrderItem } from '../shared/entities/order-item.entity';
import { ReviewsController } from './v1/controllers/reviews.controller';
import { ReviewsService } from './v1/services/reviews.service';
import { Review } from '../shared/entities/review.entity';
import { CustomerOrdersController } from './v1/controllers/customer-orders.controller';
import { CustomerOrdersService } from './v1/services/customer-orders.service';
import { VendorOrdersController } from './v1/controllers/vendor-orders.controller';
import { VendorOrdersService } from './v1/services/vendor-orders.service';
import { AttachmentsController } from './v1/controllers/attachments.controller';
import { VendorsValidation } from './v1/validations/vendors.validation';
import { CustomersValidation } from './v1/validations/customers.validation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Customer,
      Role,
      AdminsRoles,
      RolesPermissions,
      Permission,
      Reason,
      Location,
      Product,
      Vendor,
      Document,
      Attachment,
      LocationVendor,
      OnBoardingScreen,
      Complain,
      Order,
      Setting,
      OrderItem,
      Review,
    ]),
  ],
  controllers: [
    AuthController,
    CustomersController,
    RolesController,
    ReasonsController,
    LocationsController,
    ProductsController,
    VendorsController,
    AdminsController,
    DocumentsController,
    OnBoardingScreensController,
    ProfileController,
    ComplainsController,
    OrdersController,
    SettingsController,
    GeneralStatisticsController,
    ReportsController,
    ReviewsController,
    CustomerOrdersController,
    VendorOrdersController,
    AttachmentsController,
  ],
  providers: [
    AuthService,
    CustomersService,
    AdminsService,
    AdminsRolesService,
    RolesService,
    RolesPermissionsService,
    ReasonsService,
    LocationsService,
    ProductsService,
    VendorsService,
    DocumentsService,
    AttachmentsService,
    LocationsVendorsService,
    AdminsService,
    OnBoardingScreensService,
    ProfileService,
    ComplainsService,
    OrdersService,
    SettingsService,
    GeneralStatisticsService,
    ReportsService,
    OrderItemService,
    ReviewsService,
    CustomerOrdersService,
    VendorOrdersService,
    VendorsValidation,
    CustomersValidation,
  ],
})
export class AdminModule {}
