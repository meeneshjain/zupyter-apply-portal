import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModules } from '../../core/shared.module';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonModule,
    SharedModules,
    SharedSidebarModule
  ],
  exports: []
})
export class DashboardModule { }
