import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { PublicRoutingModule } from './public-routing.module';
import { MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSnackBarModule, MatAutocompleteModule, MatSlideToggleModule } from '@angular/material';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from './shared/shared.module';
import { PublicOneComponent } from './public-one/public-one.component';
import { LandingTourComponent } from './landing-tour/landing-tour.component';
import { PackageDataService } from '../services/dataService/package-data.service';
import { PackageResolverService } from '../services/dataService/package-resolver.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalFormsModule } from '../local-forms/local-forms.module';
import { HotelModule } from '../hotel/hotel.module';
import { ProfileComponent } from './profile/profile.component';
import { BookingComponent } from './booking/booking.component';
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { AgenciesService } from "../services/agencies.service";
import { CoreModule } from "../core/core.module";
import { ImageUploadModule } from "angular2-image-upload";
// import { TosComponent } from './tos/tos.component';
// import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SocialComponent } from './social/social.component';
import { SharableComponent } from './website.land.sharable/website.land.sharable.component';
import { InstantComponent } from './website.land.instant/website.land.instant.component';
// import { MegaSocialComponent } from './mega-social/mega-social.component';
import { SocialCallbackComponent } from './social-callback/social-callback.component';
import { SocialService } from '../services/social.service';
// import { CoverComponent } from './shared/cover/cover.component';
// import { ContentComponent } from './shared/content/content.component';
// import { BookComponent } from './shared/book/book.component';
import { SocialSharingComponent } from './website.land.social/website.land.social.component';
import { ThemeOneComponent } from './theme-one/theme-one.component';
import { VisaProcessComponent } from './visa-process/visa-process.component';
import { CityDetailsComponent } from './city-details/city-details.component';
// import { Website } from './website.land.instant/website.land.instant.component';
import {MatStepperModule} from '@angular/material/stepper';
import { TripDetailsComponent } from './trip-details/trip-details.component';

@NgModule({
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReCaptchaModule,
    PublicRoutingModule,
    SharedModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    SlickCarouselModule,
    MatStepperModule,
    ImageUploadModule.forRoot()

  ],
  declarations: [
    PublicOneComponent,
    LandingTourComponent,
    ProfileComponent,
    BookingComponent,
    SocialComponent,
    SharableComponent,
    SocialCallbackComponent,
    // CoverComponent,
    // ContentComponent,
    // BookComponent,
    SocialSharingComponent,
    InstantComponent,
    ThemeOneComponent,
    VisaProcessComponent,
    CityDetailsComponent,
    TripDetailsComponent

  ],
  exports: [
  ],
  providers: [PackageDataService, PackageResolverService, AuthService, UserService, AgenciesService,SocialService]
})
export class PublicModule { }
