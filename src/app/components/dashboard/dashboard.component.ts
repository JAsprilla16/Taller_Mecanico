import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  user$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}