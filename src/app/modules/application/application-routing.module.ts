import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ResumeAppComponent } from './resume-app/resume-app.component';

const routes: Routes = [
  {
    path: 'new',
    // redirectTo: 'dashboard',
    component: ApplicationComponent,
    pathMatch: 'full'
  },
  {
    path: 'resume-app',
    // redirectTo: 'dashboard',
    component: ResumeAppComponent,
    pathMatch: 'full'
  },
  {
    path: 'resume/:resume_id',
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
