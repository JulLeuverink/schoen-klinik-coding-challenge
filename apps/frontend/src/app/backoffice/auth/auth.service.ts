import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SESSION_KEY = 'backoffice';

  login(): void {
    sessionStorage.setItem(this.SESSION_KEY, new Date().toString());
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.SESSION_KEY) !== null;
  }
}
