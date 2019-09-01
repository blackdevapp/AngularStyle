import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookComponent } from './facebook/facebook.component';
import { TwitterComponent } from './twitter/twitter.component';
import { TelegramComponent } from './telegram/telegram.component';
import { LinkdinComponent } from './linkdin/linkdin.component';
import { TimlineComponent } from './timline/timline.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [FacebookComponent,
    TwitterComponent,
    TelegramComponent,
    LinkdinComponent,
    TimlineComponent],
  imports: [
    CommonModule,
  ],
  exports:[
    FacebookComponent,
    TwitterComponent,
    TelegramComponent,
    LinkdinComponent,
    TimlineComponent

  ]
})
export class SocialPostModule { }
