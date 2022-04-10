import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendMoneyComponent } from './send-money/send-money.component';
import { RequestMoneyComponent } from './request-money/request-money.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'send',
    pathMatch: 'full'
  },
  { path: 'send', component: SendMoneyComponent },
  { path: 'request', component: RequestMoneyComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendRequestMoneyRoutingModule { }
