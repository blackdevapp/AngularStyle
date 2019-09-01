import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {BookComponent} from './book/book.component';
import {ContentComponent} from './content/content.component';
import {CoverComponent} from './cover/cover.component';
import {FooterComponent} from './footer/footer.component';
import {
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule, MatSnackBarModule
} from '@angular/material';
// import { TimelineComponent } from './timeline/timeline.component';
import {PackageService} from '../../services/package.service';
import {AuthService} from "../../services/auth.service";
import {InqueriesService} from "../../services/inqueries.service";
import { ReCaptchaModule } from 'angular2-recaptcha';
import { WebsiteHeaderComponent } from './website-header/website-header.component';
import { ThemeOneHeaderComponent } from './theme-one-header/theme-one-header.component';
import { ThemeOneFooterComponent } from './theme-one-footer/theme-one-footer.component';
import { ThemeOneContactComponent } from './theme-one-contact/theme-one-contact.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactService} from "../../services/contact.service";
import {CoreModule} from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    ReCaptchaModule,
    CoreModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    // TimelineComponent,
    BookComponent,
    ContentComponent,
    CoverComponent,
    WebsiteHeaderComponent,
    ThemeOneHeaderComponent,
    ThemeOneFooterComponent,
    ThemeOneContactComponent,
  ],exports:[
    HeaderComponent,
    FooterComponent,
    // TimelineComponent,
    BookComponent,
    ContentComponent,
    CoverComponent,
    WebsiteHeaderComponent,
    ThemeOneHeaderComponent,
    ThemeOneFooterComponent,
    ThemeOneContactComponent,
  ],providers:[PackageService,AuthService,InqueriesService,ContactService]
})
export class SharedModule { }
