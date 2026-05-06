import { Routes } from '@angular/router';
import { AnamneseFormComponent } from './anamnese/anamnese-form/anamnese-form.component';
import { VerificationSuccessComponent } from './anamnese/verification-success/verification-success.component';

export const routes: Routes = [
  {
    path: 'anamnese',
    component: AnamneseFormComponent,
  },
  {
    path: 'anamnese/bestaetigung/:token',
    component: VerificationSuccessComponent,
  },
  {
    path: '',
    redirectTo: 'anamnese',
    pathMatch: 'full',
  },
];
