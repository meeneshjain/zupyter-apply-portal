import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeliveryDetailsComponent } from './delivery-details.component';


const routes: Routes = [
  {
    path: 'delivery-detail/:one',
    component: DeliveryDetailsComponent,
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryDetailsRoutingModule { }
