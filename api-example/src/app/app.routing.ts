import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { animation: '' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'register' } },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
