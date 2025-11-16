import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-solicitar-revision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-revision.html',
  styleUrls: ['./solicitar-revision.css']
})
export class SolicitarRevisionComponent {

  motivo: string = '';
  vehiculoId: string = '';
  mensaje = '';
  enviado = false;

  user$: Observable<any>;

  constructor(
    private ordenesService: OrdenesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  onSubmit() {
    if (!this.motivo.trim() || this.motivo.length < 5 || !this.vehiculoId.trim()) {
      this.mensaje = 'Por favor completa todos los campos antes de enviar.';
      return;
    }

    this.user$.subscribe(user => {
      if (!user) {
        this.mensaje = 'No hay usuario autenticado.';
        return;
      }

      const nuevaOrden: OrdenPayload = {
        vehiculoId: this.vehiculoId.trim(),
        motivo: this.motivo.trim(),
        estado: 'Pendiente',
        propietarioUid: user.uid
      };

      this.ordenesService.crearOrden(nuevaOrden)
        .then(() => {
          this.enviado = true;
          this.mensaje = 'Solicitud enviada correctamente 🚗';

          setTimeout(() => {
            this.router.navigate(['/panel']);
          }, 1500);
        })
        .catch(() => {
          this.mensaje = 'Error al enviar la solicitud. Intenta nuevamente.';
        });
    });
  }

  volver() {
    this.router.navigate(['/panel']);
  }

}
