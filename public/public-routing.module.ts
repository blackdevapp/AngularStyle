import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PublicOneComponent} from './public-one/public-one.component';
import {PackageResolverService} from '../services/dataService/package-resolver.service';
import {LandingTourComponent} from './landing-tour/landing-tour.component';
import {ProfileComponent} from './profile/profile.component';
import {BookingComponent} from './booking/booking.component';
// import {TosComponent} from "./tos/tos.component";
// import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import { SocialComponent } from './social/social.component';
import { SharableComponent } from './website.land.sharable/website.land.sharable.component';
import { InstantComponent } from './website.land.instant/website.land.instant.component';
import { SocialSharingComponent } from './website.land.social/website.land.social.component';
import { SocialCallbackComponent } from './social-callback/social-callback.component';
import {ThemeOneComponent} from "./theme-one/theme-one.component";
import {VisaProcessComponent} from "./visa-process/visa-process.component";
import {CityDetailsComponent} from "./city-details/city-details.component";
import {ThemeOneContactComponent} from "./shared/theme-one-contact/theme-one-contact.component";
import {TripDetailsComponent} from "./trip-details/trip-details.component";
import {NotFoundComponent} from "../core/not-found/not-found.component";

const routes: Routes = [
  {path:'social', component: SocialComponent},
  {path:'social/:type', component: SocialCallbackComponent},
  {path:'sharable', component: SharableComponent},
  {path:'instant', component: InstantComponent},
  {path:'social-sharing', component: SocialSharingComponent},
  {path:':id',component:PublicOneComponent},
  {path:'profile',component:ProfileComponent},
  {path:':id/landingTour/:tourId',component:LandingTourComponent,resolve: {
      routeData: PackageResolverService
  }},
  {path:':id/landingTour/:tourId/booking',component:BookingComponent},
  {path:'1/:agencyId', component: ThemeOneComponent},
  {path:'1/:agencyId/city-details', component: CityDetailsComponent},
  {path:'1/:agencyId/visa', component: VisaProcessComponent},
  {path:'1/:agencyId/contact', component: ThemeOneContactComponent},
  {path:'1/:agencyId/trip-details/:id',component: TripDetailsComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
