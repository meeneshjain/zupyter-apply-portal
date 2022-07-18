import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModules } from 'src/app/core/shared.module';

import { AutoPayRoutingModule } from './auto-pay-routing.module';
import { AutomaticPaymentsComponent } from './automatic-payments/automatic-payments.component';
import { ScheduledPaymentComponent } from './scheduled-payment/scheduled-payment.component';
import { PaymentLinksComponent } from './payment-links/payment-links.component';
import { PaymentZelleComponent } from './payment-zelle/payment-zelle.component';


@NgModule({
  declarations: [
    AutomaticPaymentsComponent,
    ScheduledPaymentComponent,
    PaymentLinksComponent,
    PaymentZelleComponent
  ],
  imports: [
    CommonModule,
    AutoPayRoutingModule,
    TabsModule.forRoot(),
    SharedModules,
    ModalModule.forRoot()
  ]
})
export class AutoPayModule { }
