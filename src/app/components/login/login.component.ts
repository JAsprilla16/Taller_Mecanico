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
  const email = await this.authService.loginWithGoogle();

  const adminEmail = "arcosasprillajose@gmail.com";

  if (email === adminEmail) {
    this.router.navigate(['/admin']);
  } else {
    this.router.navigate(['/panel']);
  }
}
}