import { Routes } from '@angular/router';
import { AnamnesenListComponent } from './anamnesen/anamnesen-list.component';
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
  //   {
  //     path: 'anamnesen/:id',
  //     //TODO: AnamnesenDetailsComponent
  //   },
  {
    path: '',
    redirectTo: 'anamnesen',
    pathMatch: 'full',
  },
];
