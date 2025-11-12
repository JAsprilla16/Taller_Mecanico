import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  user$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  irARegistrarVehiculo() {
    this.router.navigate(['/registrar-vehiculo']);
  }

  irASolicitarRevision() {
  this.router.navigate(['/solicitar-revision']);
}

irAEstadoOrden() {
  this.router.navigate(['/estado-orden']);
}

irAHistorial() {
  this.router.navigate(['/historial-servicios']);
}

logout() {
    this.authService.logout();
  }
}

