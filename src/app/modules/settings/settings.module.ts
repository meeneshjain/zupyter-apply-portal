import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { SharedModules } from 'src/app/core/shared.module';
import { ModalModule } from "ngx-bootstrap/modal";
/// import { SiderbarComponent } from 'src/app/layout/siderbar/siderbar.component';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
@NgModule({
  declarations: [
    ProfileSettingComponent,
 //  SiderbarComponent

],
imports: [
  CommonModule,
  SharedModules,
  SharedSidebarModule,
  SettingsRoutingModule,
  ModalModule.forRoot()
  ],
})
export class SettingsModule { }
