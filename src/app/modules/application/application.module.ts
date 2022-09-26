import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';

import { SharedModules } from '../../core/shared.module';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxSignaturepadModule } from 'ngx-signaturepad2';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ResumeAppComponent } from './resume-app/resume-app.component';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    ApplicationComponent,
    ResumeAppComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModules,
    SharedSidebarModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    NgxSignaturepadModule,
    NgWizardModule.forRoot(ngWizardConfig),
    GooglePlaceModule
  ]
})
export class ApplicationModule { }
