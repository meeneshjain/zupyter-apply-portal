import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomaticPaymentsComponent } from './automatic-payments/automatic-payments.component';
import { ScheduledPaymentComponent } from './scheduled-payment/scheduled-payment.component';
import { PaymentLinksComponent } from './payment-links/payment-links.component';
import { PaymentZelleComponent } from './payment-zelle/payment-zelle.component';

const routes: Routes = [
  { path: 'automatic-payment', component: AutomaticPaymentsComponent },
  { path: 'scheduled-payment', component: ScheduledPaymentComponent },
  { path: 'payment-links', component: PaymentLinksComponent },
  { path: 'payment-zelle', component: PaymentZelleComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoPayRoutingModule { }
