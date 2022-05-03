import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsBankingRoutingModule } from './cards-banking-routing.module';
import { CardsBankingComponent } from './cards-banking.component';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModules } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    CardsBankingComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModules,
    CardsBankingRoutingModule,
    SharedSidebarModule,
    ModalModule.forRoot()
  ]
})
export class CardsBankingModule { }
