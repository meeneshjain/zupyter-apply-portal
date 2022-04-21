import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendRequestMoneyRoutingModule } from './send-request-money-routing.module';
import { SendMoneyComponent } from './send-money/send-money.component';
import { RequestMoneyComponent } from './request-money/request-money.component';
import { ModalModule } from "ngx-bootstrap/modal";


@NgModule({
  declarations: [
    SendMoneyComponent,
    RequestMoneyComponent
  ],
  imports: [
    CommonModule,
    SendRequestMoneyRoutingModule,
    ModalModule.forRoot()
  ]
})
export class SendRequestMoneyModule { }
