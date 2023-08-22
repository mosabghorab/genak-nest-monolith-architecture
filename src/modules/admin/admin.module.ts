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
  ],
})
export class AdminModule {}
