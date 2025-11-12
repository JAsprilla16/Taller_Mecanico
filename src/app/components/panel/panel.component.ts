import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html'
})
export class PanelComponent  {

  user$: Observable<any>; // <-- declaramos la propiedad

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$; // <-- asignamos el observable del servicio
  }
  

  irARegistrarVehiculo() {
    this.router.navigate(['/registrar-vehiculo']);
  }

  logout() {
    this.authService.logout();
  }
  

}

