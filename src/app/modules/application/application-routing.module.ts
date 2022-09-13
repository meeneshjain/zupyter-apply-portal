import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: 'new',
    // redirectTo: 'dashboard',
    component: ApplicationComponent,
    pathMatch: 'full'
  },
  {
    path: 'resume',
    // redirectTo: 'dashboard',
    component: ApplicationComponent,
    pathMatch: 'full'
  },
  // { path: 'dashboard', component: DashboardComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
