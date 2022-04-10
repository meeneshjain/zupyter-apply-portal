import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'dashboard',
    component: TransactionsComponent,
    pathMatch: 'full'
  },
  // { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
 