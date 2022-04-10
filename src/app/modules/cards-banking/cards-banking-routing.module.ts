import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsBankingComponent } from './cards-banking.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'dashboard',
    component: CardsBankingComponent,
    pathMatch: 'full'
  },
  // { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsBankingRoutingModule { }
