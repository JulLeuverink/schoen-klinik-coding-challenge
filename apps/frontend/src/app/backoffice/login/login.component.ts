import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);

  onStaffLogin() {
    this.router.navigateByUrl('/backoffice');
  }

  onAdminLogin() {
    this.router.navigateByUrl('/backoffice');
  }
}
