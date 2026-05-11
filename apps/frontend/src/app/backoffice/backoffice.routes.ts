import { Routes } from '@angular/router';
import { AnamnesenListComponent } from './anamnesen/anamnesen-list.component';
import { AnamneseDetailComponent } from './anamnesen/detail/anamnese-detail.component';
import { authGuard } from './auth/auth.guard';
import { BackofficeLayoutComponent } from './backoffice-layout.component/backoffice-layout.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: BackofficeLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'anamnesen',
        component: AnamnesenListComponent,
      },
      {
        path: 'anamnesen/:id',
        component: AnamneseDetailComponent,
      },
      { path: '', redirectTo: 'anamnesen', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
