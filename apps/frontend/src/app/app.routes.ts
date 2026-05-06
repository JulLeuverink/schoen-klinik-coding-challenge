import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.routes').then((m) => m.routes),
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.routes').then((m) => m.routes),
  },
];
