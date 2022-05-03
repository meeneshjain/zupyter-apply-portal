import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { PayNowComponent } from './pay-now/pay-now.component';
import { PayConfirmComponent } from './pay-confirm/pay-confirm.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'dashboard',
    component: TransactionsComponent,
    pathMatch: 'full'
  },
  { path: 'pay-now', component: PayNowComponent },
  { path: 'pay-confirm/:one', component: PayConfirmComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
 