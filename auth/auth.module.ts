import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {SingupComponent} from "./singup/singup.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {OnBoardingComponent} from "./on-boarding/on-boarding.component";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {AgenciesService} from "../services/agencies.service";
import {PackageService} from "../services/package.service";
import {InqueriesService} from "../services/inqueries.service";
import {PanelRoutingModule} from "../panel/panel-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../core/core.module";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {
  MatAutocompleteModule, MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatMenuModule,
  MatNativeDateModule, MatSnackBarModule
} from "@angular/material";
import {RouterModule} from "@angular/router";
import {LocalFormsModule} from "../local-forms/local-forms.module";
import {HotelModule} from "../hotel/hotel.module";
import {AmazingTimePickerModule} from "amazing-time-picker";
import {ImageUploadModule} from "angular2-image-upload";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {SharedModule} from "../public/shared/shared.module";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {ReCaptchaModule} from "angular2-recaptcha";
import {UploadService} from "../services/upload.service";
import { CompanyComponent } from './company/company.component';
import { VanComponent } from './van/van.component';
import { AgencyComponent } from './agency/agency.component';
import {ContentLoaderModule} from "@netbasal/ngx-content-loader";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    CoreModule,
    MatMenuModule,
    CoreModule,
    ReactiveFormsModule,
    RouterModule,
    LocalFormsModule,
    HotelModule,
    AmazingTimePickerModule,
    MatAutocompleteModule,
    ImageUploadModule.forRoot(),
    SlickCarouselModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    SharedModule,
    MatIconModule,
    ContentLoaderModule,
    LeafletModule.forRoot(),
    ReCaptchaModule,
    // ZXingScannerModule.forRoot(),
  ],
  declarations: [
    SingupComponent,
    LoginComponent,
    LogoutComponent,
    OnBoardingComponent,
    CompanyComponent,
    VanComponent,
    AgencyComponent
  ],
  providers: [
    AuthService,
    UserService,
    AgenciesService,
    PackageService,
    InqueriesService,
    UploadService

  ],
})
export class AuthModule { }
