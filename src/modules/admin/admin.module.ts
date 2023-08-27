import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Customer } from '../shared/entities/customer.entity';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { AdminsService } from './services/admins.service';
import { AdminsRolesService } from './services/admins-roles.service';
import { RolesService } from './services/roles.service';
import { Role } from './entities/role.entity';
import { AdminsRoles } from './entities/admins-roles.entity';
import { RolesPermissions } from './entities/roles-permissions.entity';
import { Permission } from './entities/permission';
import { RolesPermissionsService } from './services/roles-permissions.service';
import { RolesController } from './controllers/roles.controller';
import { ReasonsService } from './services/reasons.service';
import { ReasonsController } from './controllers/reasons.controller';
import { Reason } from '../shared/entities/reason.entity';
import { Location } from '../shared/entities/location.entity';
import { LocationsController } from './controllers/locations.controller';
import { LocationsService } from './services/locations.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from '../shared/entities/product.entity';
import { Vendor } from '../shared/entities/vendor.entity';
import { VendorsService } from './services/vendors.service';
import { DocumentsService } from './services/documents.service';
import { Document } from '../shared/entities/document.entity';
import { Attachment } from '../shared/entities/attachment.entity';
import { AttachmentsService } from './services/attachments.service';
import { VendorsController } from './controllers/vendors.controller';
import { LocationsVendorsService } from './services/locations-vendors.service';
import { LocationVendor } from '../shared/entities/location-vendor.entity';
import { AdminsController } from './controllers/admins.controller';
import { DocumentsController } from './controllers/documents.controller';
import { OnBoardingScreen } from '../shared/entities/on-boarding-screen.entity';
import { OnBoardingScreensController } from './controllers/on-boarding-screens.controller';
import { OnBoardingScreensService } from './services/on-boarding-screens.service';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ComplainsService } from './services/complains.service';
import { ComplainsController } from './controllers/complains.controller';
import { Complain } from '../shared/entities/complain.entity';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from '../shared/entities/order.entity';
import { Setting } from '../shared/entities/setting.entity';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';
import { GeneralStatisticsController } from './controllers/general-statistics.controller';
import { GeneralStatisticsService } from './services/general-statistics.service';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { OrderItemService } from './services/order-item.service';
import { OrderItem } from '../shared/entities/order-item.entity';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { Review } from '../shared/entities/review.entity';
import { CustomerOrdersController } from './controllers/customer-orders.controller';
import { CustomerOrdersService } from './services/customer-orders.service';
import { VendorOrdersController } from './controllers/vendor-orders.controller';
import { VendorOrdersService } from './services/vendor-orders.service';

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
  ],
})
export class AdminModule {}
