import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { showHeader: true, showFooter: true }
  },
  {
    path: 'delivery',
    loadChildren: () => import('./modules/delivery-details/delivery-details.module').then(m => m.DeliveryDetailsModule),
    data: { showHeader: true, showFooter: true }
  },
  
  {
    path: 'cards-banking',
    loadChildren: () => import('./modules/cards-banking/cards-banking.module').then(m => m.CardsBankingModule),
    data: { showHeader: true, showFooter: true }
  },
 
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
    data: { showHeader: true, showFooter: true }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),
    data: { showHeader: true, showFooter: true }
  },
  
  {
    path: 'account-verification',
    loadChildren: () => import('./modules/bank-account/bank-account.module').then(m => m.BankAccountModule),
    data: { showHeader: true, showFooter: true }
  },
 
]


const config: ExtraOptions = {
  useHash: true,
};


@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
