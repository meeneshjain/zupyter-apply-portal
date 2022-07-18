import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModules } from 'src/app/core/shared.module';

import { BankAccountRoutingModule } from './bank-account-routing.module';
import { AccountVerifyComponent } from './account-verify/account-verify.component';
import { VerificationProgressComponent } from './verification-progress/verification-progress.component';


@NgModule({
  declarations: [
    AccountVerifyComponent,
    VerificationProgressComponent
  ],
  imports: [
    CommonModule,
    BankAccountRoutingModule,
    CommonModule,
    SharedModules,
    ModalModule.forRoot()
  ]
})
export class BankAccountModule { }
