import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SingupComponent} from "./singup/singup.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {HotelManagementComponent} from "../hotel/hotel-management/hotel-management.component";
import {CheckinComponent} from "../hotel/checkin/checkin.component";
import {OnBoardingComponent} from "./on-boarding/on-boarding.component";
import {CompanyComponent} from "./company/company.component";
import {VanComponent} from "./van/van.component";

const routes: Routes = [
  { path: 'signup',                   component: SingupComponent},
  { path: 'login',                    component: LoginComponent},
  { path: 'logout',                   component: LogoutComponent },
  { path: 'onboarding',              component: OnBoardingComponent },
  { path: 'company',              component: CompanyComponent },
  { path: 'van',              component: VanComponent },
  {path: '', redirectTo: 'login', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
