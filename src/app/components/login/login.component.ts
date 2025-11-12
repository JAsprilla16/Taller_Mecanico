import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
}