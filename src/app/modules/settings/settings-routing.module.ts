import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { SetupConfigComponent } from './setup-config/setup-config.component';
import { SystemUsersComponent } from './system-users/system-users.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  { path: 'profile', component: ProfileSettingComponent },
  { path: 'setup', component: SetupConfigComponent },
  { path: 'setup/system-users', component: SystemUsersComponent },
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
