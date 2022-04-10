import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModules } from './core/shared.module';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
//import { SiderbarComponent } from 'src/app/layout/siderbar/siderbar.component';
import { SharedSidebarModule } from 'src/app/core/shared.sidebar.module';
@NgModule({
  declarations: [
    AppComponent,
  //  SiderbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSkeletonLoaderModule.forRoot(),
    AppRoutingModule,
    SharedModules,
  //  SharedSidebarModule
  ],
  exports: [SharedModules],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
