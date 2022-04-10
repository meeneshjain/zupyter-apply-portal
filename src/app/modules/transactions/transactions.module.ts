import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';

@NgModule({
  declarations: [
    TransactionsComponent,
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule.forRoot(),
    TransactionsRoutingModule,
    SharedSidebarModule
  ]
})
export class TransactionsModule { }
