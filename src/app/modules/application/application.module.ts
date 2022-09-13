import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';

import { SharedModules } from '../../core/shared.module';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxSignaturepadModule } from 'ngx-signaturepad2';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModules,
    SharedSidebarModule,
    ModalModule.forRoot(),
    NgxSignaturepadModule,
    NgWizardModule.forRoot(ngWizardConfig),
  ]
})
export class ApplicationModule { }
