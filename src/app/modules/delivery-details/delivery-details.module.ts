import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryDetailsRoutingModule } from './delivery-details-routing.module';
import { DeliveryDetailsComponent } from './delivery-details.component';
import { SharedModules } from '../../core/shared.module';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxSignaturepadModule } from 'ngx-signaturepad2';

@NgModule({
  declarations: [
    DeliveryDetailsComponent
  ],
  imports: [
    CommonModule,
    DeliveryDetailsRoutingModule,
    SharedModules,
    SharedSidebarModule,
    ModalModule.forRoot(),
    NgxSignaturepadModule,
  ]
})
export class DeliveryDetailsModule { }
