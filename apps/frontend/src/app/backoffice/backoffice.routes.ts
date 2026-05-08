import { Routes } from '@angular/router';
import { AnamnesenListComponent } from './anamnesen/anamnesen-list.component';
import { AnamneseDetailComponent } from './anamnesen/detail/anamnese-detail.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'anamnesen',
    component: AnamnesenListComponent,
  },
  {
    path: 'anamnesen/:id',
    component: AnamneseDetailComponent,
  },
  {
    path: '',
    redirectTo: 'anamnesen',
    pathMatch: 'full',
  },
];
