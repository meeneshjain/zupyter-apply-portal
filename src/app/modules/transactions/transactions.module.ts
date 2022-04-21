import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { PayNowComponent } from './pay-now/pay-now.component';
import { PayConfirmComponent } from './pay-confirm/pay-confirm.component';
import { SharedModules } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    TransactionsComponent,
    PayNowComponent,
    PayConfirmComponent,
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule.forRoot(),
    TransactionsRoutingModule,
    SharedSidebarModule,
    SharedModules
  ]
})
export class TransactionsModule { }
