import { Module } from '@nestjs/common';
import { OrdersController } from './v1/controllers/orders.controller';
import { OrdersService } from './v1/services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Reason } from './entities/reason.entity';
import { ReasonsController } from './v1/controllers/reasons.controller';
import { LocationsService } from './v1/services/locations.service';
import { LocationsController } from './v1/controllers/locations.controller';
import { Location } from './entities/location.entity';
import { ReasonsService } from './v1/services/reasons.service';
import { OnBoardingScreensService } from './v1/services/on-boarding-screens.service';
import { OnBoardingScreensController } from './v1/controllers/on-boarding-screens.controller';
import { OnBoardingScreen } from './entities/on-boarding-screen.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './v1/controllers/settings.controller';
import { SettingsService } from './v1/services/settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Reason,
      Location,
      OnBoardingScreen,
      Setting,
    ]),
  ],
  controllers: [
    OrdersController,
    ReasonsController,
    LocationsController,
    OnBoardingScreensController,
    SettingsController,
  ],
  providers: [
    OrdersService,
    LocationsService,
    ReasonsService,
    OnBoardingScreensService,
    SettingsService,
  ],
  exports: [LocationsService],
})
export class SharedModule {}
