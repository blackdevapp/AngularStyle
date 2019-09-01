import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PackagesComponent} from "./packages/packages.component";
import {ComponentComponent} from "./component/component.component";
import {InqueriesComponent} from "./inqueries/inqueries.component";
import {AdminsComponent} from "./admins/admins.component";
import {ProfileComponent} from "./profile/profile.component";
import {AnnouncementsComponent} from "./announcements/announcements.component";
import {TypographyComponent} from "./typography/typography.component";
import {IconsComponent} from "./icons/icons.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {UpgradeComponent} from "./upgrade/upgrade.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {MarketingComponent} from "./marketing/marketing.component";
import {ComponentResolverService} from "../services/dataService/component-resolver.service";
import {AuthGuardAdmin} from "../services/guard/auth-guard-admin.service";
import {FormBuilderComponent} from "./form-builder/form-builder.component";
import {AccountingComponent} from "./accounting/accounting.component";
import {AuthGuardAgent} from "../services/guard/auth-guard-agent.service";
import {AuthGuardSuperAdmin} from "../services/guard/auth-guard-super-admin.service";
import {ServerLogsComponent} from "./server-logs/server-logs.component"
import { AuthGuardEncoder } from '../services/guard/auth-guard-encoder.service';
import {NotFoundComponent} from "../core/not-found/not-found.component";
import {AuthGuard} from "../services/guard/auth-guard.service";

const routes: Routes = [
  {path:'',component:MainPageComponent,children:[
      {path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard], data: { roles: ['admin','agent'] } },
      {path:'packages', component: PackagesComponent,canActivate: [AuthGuard], data: { roles: ['admin','agent','encoder','van-driver','company'] }},
      {path:'component', component: ComponentComponent, resolve: {routeData: ComponentResolverService},canActivate: [AuthGuard], data: { roles: ['admin','agent','encoder','van-driver'] }},
      {path:'serverLogs', component: ServerLogsComponent,canActivate: [AuthGuard], data: { roles: ['superadmin'] }},
      {path:'admin', component: AdminsComponent,canActivate: [AuthGuard], data: { roles: ['superadmin'] }},
      {path:'profile', component: ProfileComponent,canActivate: [AuthGuard], data: { roles: ['admin','encoder','agent','user','van-driver','tour-guide','company'] }},
      {path:'formBuilder', component: FormBuilderComponent,canActivate: [AuthGuard], data: { roles: ['admin','encoder','agent'] }},
      {path:'marketing', component: MarketingComponent,canActivate: [AuthGuard], data: { roles: ['admin'] }},
      {path:'privacy', component: AnnouncementsComponent},
      {path:'accounting', component: AccountingComponent,canActivate: [AuthGuard], data: { roles: ['admin','agent'] }},
      { path: 'typography',component: TypographyComponent},
      { path: 'icons',component: IconsComponent},
      { path: 'notifications',component: NotificationsComponent},
      { path: 'upgrade',component: UpgradeComponent},
      {path: '',redirectTo: 'dashboard', pathMatch: 'full'},
      {path:'inqueries', component: InqueriesComponent,canActivate: [AuthGuard], data: { roles: ['admin','superadmin','agent','user','company'] }}
    ]},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
