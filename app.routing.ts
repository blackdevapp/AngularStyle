import {NgModule} from '@angular/core';
import {CommonModule,} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';
import {WebsiteComponent} from './public/website/website.component';
import {NotFoundComponent} from "./core/not-found/not-found.component";
import {NoAccessComponent} from "./core/no-access/no-access.component";

const routes: Routes = [
  {path: 'public', loadChildren: './public/public.module#PublicModule'},
  {path: 'panel', loadChildren: './panel/panel.module#PanelModule'},
  {path: 'print-template', loadChildren: './print-template/print-template.module#PrintTemplateModule'},
  {path: '', loadChildren: './auth/auth.module#AuthModule'},
  // {path: '', component: WebsiteComponent},
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '404', component: NotFoundComponent},
  {path: 'no-access', component: NoAccessComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [],
})
export class AppRoutingModule {
}
