import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common"

import { LocalFormsModule } from '../local-forms/local-forms.module';

import { HotelManagementComponent } from '../hotel/hotel-management/hotel-management.component';
import { CheckinComponent } from '../hotel/checkin/checkin.component';
import { SchedulerComponent } from '../hotel/scheduler/scheduler.component';
import { CardsComponent } from './cards/cards.component';
import {CoreModule} from "../core/core.module";

@NgModule({
  declarations: [
    HotelManagementComponent,
    CheckinComponent,
    SchedulerComponent, 
    CardsComponent
  ],
  exports:[
    HotelManagementComponent,
    CheckinComponent,
    SchedulerComponent
  ],
  imports: [
    CoreModule,
    LocalFormsModule,
    FormsModule,
    CommonModule
  ],
  providers: [
  ],
  entryComponents: [CheckinComponent]
})
export class HotelModule { }
