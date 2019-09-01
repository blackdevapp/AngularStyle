import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app.routing';
import { ImageUploadModule } from "angular2-image-upload";
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatAutocompleteModule
} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';

import { AmazingTimePickerModule } from 'amazing-time-picker';
// import { QuillEditorModule } from 'ngx-quill-editor';

import { AppComponent } from './app.component';

import { DashboardComponent } from './panel/dashboard/dashboard.component';
import { PackagesComponent } from './panel/packages/packages.component';
import { ComponentComponent } from './panel/component/component.component';
import { TypographyComponent } from './panel/typography/typography.component';
import { IconsComponent } from './panel/icons/icons.component';
import { MapsComponent } from './core/maps/maps.component';
import { NotificationsComponent } from './panel/notifications/notifications.component';
import { UpgradeComponent } from './panel/upgrade/upgrade.component';
import { PublicOneComponent } from './public/public-one/public-one.component';
import { SingupComponent } from './auth/singup/singup.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { UserService } from './services/user.service';
import { VisaService } from './services/visa.service';
import { AuthService } from './services/auth.service';
import { HotelService } from './services/hotel.service';
import { AgenciesService } from './services/agencies.service';
import { PackageService } from './services/package.service';
import { EmailService } from './services/email.service';
import { DateManagerService } from './services/date-manager.service';
import { ImageService } from './services/image.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/guard/auth-guard-admin.service';
import { AuthGuardAgent } from './services/guard/auth-guard-agent.service';
import { LocalFormsModule } from './local-forms/local-forms.module';
import { HotelModule } from './hotel/hotel.module';
import { PublicModule } from './public/public.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AdminsComponent } from './panel/admins/admins.component';
import { WebsiteComponent } from './public/website/website.component';
import { ProfileComponent } from './panel/profile/profile.component';
import { ReCaptchaModule } from 'angular2-recaptcha';
import {PackageDataService} from './services/dataService/package-data.service';
import {PackageResolverService} from './services/dataService/package-resolver.service';
import { InqueriesComponent } from './panel/inqueries/inqueries.component';
import {AnnouncementsComponent} from './panel/announcements/announcements.component';
import {MatIconModule} from '@angular/material/icon';
import {InqueriesService} from './services/inqueries.service';
import {ScrollableDirective} from './core/directives/scrollable.directive';
import {SharedModule} from './public/shared/shared.module';
import {CoreModule} from './core/core.module';
import {ComponentResolverService} from './services/dataService/component-resolver.service';
import {ComponentDataService} from './services/dataService/component-data.service';
import {OnBoardingComponent} from "./auth/on-boarding/on-boarding.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// import {TosComponent} from "./public/tos/tos.component";
// import {PrivacyPolicyComponent} from "./public/privacy-policy/privacy-policy.component";
import { SocialService } from './services/social.service';
import {NotFoundComponent} from "./core/not-found/not-found.component";

// import { HotelManagementComponent } from './hotel//hotel-management/hotel-management.component';
// import {SchedulerComponent} from "./components/scheduler.component";

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,

    // TosComponent,
    // PrivacyPolicyComponent,
    WebsiteComponent
  ],
  imports: [ 
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    HttpModule,
    MatMenuModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
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
    ReCaptchaModule,
    LeafletModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    AuthGuardAgent,
    UserService,
    VisaService,
    HotelService,
    AgenciesService,
    PackageService,
    DateManagerService,
    EmailService,
    InqueriesService,
    ComponentResolverService,
    ComponentDataService,
    SocialService,
    ImageService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
