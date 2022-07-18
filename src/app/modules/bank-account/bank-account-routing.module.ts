import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountVerifyComponent } from './account-verify/account-verify.component';
import { VerificationProgressComponent } from './verification-progress/verification-progress.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'dashboard',
    component: AccountVerifyComponent,
    pathMatch: 'full'
  },
  { path: 'in-process', component: VerificationProgressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }
