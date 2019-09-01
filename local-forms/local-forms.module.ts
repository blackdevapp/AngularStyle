import {NgModule} from '@angular/core';

import {ComponentService} from '../services/component.service';

import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatMenuModule,
  MatAutocompleteModule,
} from '@angular/material';
import {AmazingTimePickerModule} from 'amazing-time-picker';
import {RestaurantComponent} from './restaurant/restaurant.component';
import {ImageUploadModule} from "angular2-image-upload";
import {LaundryComponent} from './laundry/laundry.component';
import {HousekeepingComponent} from './housekeeping/housekeeping.component';
import {TransportationComponent} from './transportation/transportation.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {ProfileComponent} from './profile/profile.component';
import {MatIconModule} from '@angular/material/icon';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CommonModule, DatePipe} from '@angular/common';
import {UserDataService} from '../services/dataService/user-data.service';
import {PersonalInformationComponent} from './on-boarding/personal-information/personal-information.component';
import {AgencyInformationComponent} from './on-boarding/agency-information/agency-information.component';
import {SocialMediaComponent} from './on-boarding/social-media/social-media.component';
import {TaxIdentificationComponent} from './on-boarding/tax-identification/tax-identification.component';
import {VisaComponent} from './visa/visa.component';
import {CoreModule} from "../core/core.module";
import { TelegramComponent } from './telegram/telegram.component';
import {AirplaneComponent} from "./airplane/airplane.component";
import {CarVanComponent} from "./car-van/car-van.component";
import {RegistrationComponent} from "./registration/registration.component";
import {BoatShipComponent} from "./boat-ship/boat-ship.component";
import {HotelRoomComponent} from "./hotel-room/hotel-room.component";
import {TourGuideComponent} from "./tour-guide/tour-guide.component";
import {BusComponent} from "./bus/bus.component";
import {AgencyComponent} from "./agency/agency.component";
import { UploadService } from '../services/upload.service';
import { ManualTransactionComponent } from './manual-transaction/manual-transaction.component';
import {MatTabsModule} from '@angular/material/tabs';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AirplaneComponent,
    BusComponent,
    TourGuideComponent,
    CarVanComponent,
    HotelRoomComponent,
    BoatShipComponent,
    RegistrationComponent,
    RestaurantComponent,
    LaundryComponent,
    HousekeepingComponent,
    TransportationComponent,
    ProfileComponent,
    AgencyComponent,
    PersonalInformationComponent,
    AgencyInformationComponent,
    SocialMediaComponent,
    TaxIdentificationComponent,
    VisaComponent,
    TelegramComponent,
    ManualTransactionComponent


  ],
  exports: [
    AirplaneComponent,
    BusComponent,
    TourGuideComponent,
    CarVanComponent,
    HotelRoomComponent,
    BoatShipComponent,
    RegistrationComponent,
    RestaurantComponent,
    LaundryComponent,
    HousekeepingComponent,
    TransportationComponent,
    ProfileComponent,
    PersonalInformationComponent,
    AgencyInformationComponent,
    SocialMediaComponent,
    TaxIdentificationComponent,
    AgencyComponent,
    VisaComponent,
    TelegramComponent,
    ManualTransactionComponent,
    FormsModule

  ],
  imports: [
    CoreModule,
    CurrencyMaskModule,
    FormsModule,
    MatMenuModule,
    CommonModule,
    ImageUploadModule.forRoot(),
    FlexLayoutModule,
    AmazingTimePickerModule,
    MatCardModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTabsModule,
    SlickCarouselModule

  ],
  providers: [
    ComponentService,
    UploadService,
    DatePipe, UserDataService
  ]
})
export class LocalFormsModule {
}
