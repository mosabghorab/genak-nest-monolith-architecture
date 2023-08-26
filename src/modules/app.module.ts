import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Customer } from './shared/entities/customer.entity';
import { Admin } from './admin/entities/admin.entity';
import { Product } from './shared/entities/product.entity';
import { Vendor } from './shared/entities/vendor.entity';
import { LocationVendor } from './shared/entities/location-vendor.entity';
import { Role } from './admin/entities/role.entity';
import { CustomerAddress } from './customer/entities/customer-address.entity';
import { Permission } from './admin/entities/permission';
import { RolesPermissions } from './admin/entities/roles-permissions.entity';
import { AdminsRoles } from './admin/entities/admins-roles.entity';
import { Reason } from './shared/entities/reason.entity';
import { Location } from './shared/entities/location.entity';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from '../core/guards/auth.guard';
import { Order } from './shared/entities/order.entity';
import { OrderItem } from './shared/entities/order-item.entity';
import { OrderStatusHistory } from './shared/entities/order-status-history.entity';
import { Review } from './shared/entities/review.entity';
import { Complain } from './shared/entities/complain.entity';
import { Document } from './shared/entities/document.entity';
import { Attachment } from './shared/entities/attachment.entity';
import { VendorModule } from './vendor/vendor.module';
import { OnBoardingScreen } from './shared/entities/on-boarding-screen.entity';
import { Setting } from './shared/entities/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.' + (process.env.NODE_ENV || 'development'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '15h' },
        };
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 10000, // time to live in mille seconds.
      // * for redis only *.
      // store: redisStore,
      // host: 'localhost',
      // port: 6379,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [
            Customer,
            Admin,
            Product,
            Vendor,
            Location,
            LocationVendor,
            CustomerAddress,
            Role,
            Permission,
            RolesPermissions,
            AdminsRoles,
            Reason,
            Order,
            OrderItem,
            OrderStatusHistory,
            Review,
            Complain,
            Document,
            Attachment,
            OnBoardingScreen,
            Setting,
          ],
          synchronize: true,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname.replace('/modules', '/'), '..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    AdminModule,
    CustomerModule,
    VendorModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
