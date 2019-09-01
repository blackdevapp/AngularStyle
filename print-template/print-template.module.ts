import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintTemplateRoutingModule } from './print-template-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ComponentService } from '../services/component.service';
import { AgenciesService } from '../services/agencies.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PrintTemplateRoutingModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [InvoiceComponent],
  providers:[ComponentService,
    AgenciesService]
    
})
export class PrintTemplateModule { }
