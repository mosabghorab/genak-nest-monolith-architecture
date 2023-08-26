import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Reason } from './entities/reason.entity';
import { ReasonsController } from './controllers/reasons.controller';
import { LocationsService } from './services/locations.service';
import { LocationsController } from './controllers/locations.controller';
import { Location } from './entities/location.entity';
import { ReasonsService } from './services/reasons.service';
import { OnBoardingScreensService } from './services/on-boarding-screens.service';
import { OnBoardingScreensController } from './controllers/on-boarding-screens.controller';
import { OnBoardingScreen } from './entities/on-boarding-screen.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';

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
