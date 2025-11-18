import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
  try {
    const cred = await this.authService.loginWithGoogle();

    if (!cred || !cred.user) {
      console.error("No se pudo obtener el usuario.");
      return;
    }

    const email = cred.user.email;
    const adminEmail = "arcosasprillajose@gmail.com";

    if (email === adminEmail) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/panel']);
    }

  } catch (err) {
    console.error("Error al iniciar sesión:", err);
  }
}

}

