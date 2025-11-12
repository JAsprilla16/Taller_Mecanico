import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-solicitar-revision',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-revision.html',
  styleUrls: ['./solicitar-revision.css']
})
export class SolicitarRevisionComponent {
  form: any;
  mensaje = '';
  enviado = false;
  user$: Observable<any>;
  vehiculoId: string = '';

  constructor(
    private fb: FormBuilder,
    private ordenesService: OrdenesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
    this.form = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.vehiculoId.trim()) {
      this.mensaje = 'Por favor completa todos los campos antes de enviar.';
      return;
    }

    const val = this.form.value;

    this.user$.subscribe(user => {
      if (!user) {
        this.mensaje = 'No hay usuario autenticado.';
        return;
      }

      const nuevaOrden: OrdenPayload = {
        vehiculoId: this.vehiculoId.trim(),
        motivo: val.motivo.trim(),
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
    }); // <-- cierra correctamente el subscribe
  }
}
