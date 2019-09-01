import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { InqueriesComponent } from "./inqueries/inqueries.component";
import { AnnouncementsComponent } from "./announcements/announcements.component";
import { PackagesComponent } from "./packages/packages.component";
import { ComponentComponent } from "./component/component.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../core/core.module";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {
  MatAutocompleteModule, MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatMenuModule,
  MatNativeDateModule, MatSnackBarModule, MatSlideToggleModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { LocalFormsModule } from "../local-forms/local-forms.module";
import { HotelModule } from "../hotel/hotel.module";
import { AmazingTimePickerModule } from "amazing-time-picker";
import { ImageUploadModule } from "angular2-image-upload";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule } from "../public/shared/shared.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { ReCaptchaModule } from "angular2-recaptcha";
import { JwtModule } from "@auth0/angular-jwt";
import { tokenGetter } from "../app.module";
import { AdminsComponent } from "./admins/admins.component";
import { UserService } from "../services/user.service";
import { VisaService } from "../services/visa.service";
import { HotelService } from "../services/hotel.service";
import { AgenciesService } from "../services/agencies.service";
import { PackageService } from "../services/package.service";
import { DateManagerService } from "../services/date-manager.service";
import {ServerService} from "../services/server.service"
import { EmailService } from "../services/email.service";
import { InqueriesService } from "../services/inqueries.service";
import { ComponentResolverService } from "../services/dataService/component-resolver.service";
import { ComponentDataService } from "../services/dataService/component-data.service";
import { TypographyComponent } from "./typography/typography.component";
import { IconsComponent } from "./icons/icons.component";
import { MapsComponent } from "../core/maps/maps.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { UpgradeComponent } from "./upgrade/upgrade.component";
import { AuthGuardAdmin } from "../services/guard/auth-guard-admin.service";
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { AuthGuardSuperAdmin } from "../services/guard/auth-guard-super-admin.service";
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MarketingComponent } from './marketing/marketing.component';
import { AccountingComponent } from './accounting/accounting.component';
import { AccountingService } from '../services/accounting.service';
import {UploadService} from "../services/upload.service";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {SocialPostModule} from "../social-post/social-post.module";
import {DatePipe} from "../pipes/date.pipe";
import {AuthGuard} from "../services/guard/auth-guard.service";
import { ServerLogsComponent } from './server-logs/server-logs.component';
import {ContentLoaderModule} from "@netbasal/ngx-content-loader";


@NgModule({
  imports: [
    CommonModule,
    PanelRoutingModule,
    FormsModule,
    CoreModule,
    MatMenuModule,
    SocialPostModule,
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
    MatCheckboxModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSnackBarModule,
    SharedModule,
    MatChipsModule,
    MatIconModule,
    LeafletModule.forRoot(),
    ReCaptchaModule,
    CurrencyMaskModule,
    MatStepperModule,
    MatTabsModule,
    CKEditorModule,
      ContentLoaderModule
  ],
  declarations: [MainPageComponent,DatePipe,
    DashboardComponent,
    ProfileComponent,
    TypographyComponent,
    UpgradeComponent,
    IconsComponent,
    NotificationsComponent,
    InqueriesComponent,
    AnnouncementsComponent,
    PackagesComponent,
    AdminsComponent,
    ComponentComponent,
    FormBuilderComponent,
    MarketingComponent,
    AccountingComponent,
    ServerLogsComponent],
  providers: [
    UserService,
    VisaService,
    AuthGuardAdmin,
    AuthGuard,
    HotelService,
    AgenciesService,
    AuthGuardSuperAdmin,
    AccountingService,
    PackageService,
    DateManagerService,
    EmailService,
    InqueriesService,
    UploadService,
    ComponentResolverService,
    ComponentDataService,
    ServerService
  ]
})
export class PanelModule {
}
