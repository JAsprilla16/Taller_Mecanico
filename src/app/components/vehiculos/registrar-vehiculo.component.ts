import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculosService, VehiculoPayload } from '../../services/vehiculos.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

interface VehiculoForm {
  placa: string;
  marca: string;
  modelo: string;
  color: string | null;
  anho: number;
}

@Component({
  selector: 'app-registrar-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-vehiculo.component.html',
})
export class RegistrarVehiculoComponent {
  form: any;

  submitting = false;
  errorMsg = '';

  // Obtenemos usuario actual para guardar propietarioUid
  user$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;

    // Inicializar el formulario aquí para evitar usar `fb` antes de la inyección
    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: [''],
      anho: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear()+1)]],
    });
  }

  async onSubmit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Obtener el usuario actual (como snapshot). user$ es observable; para simplicidad: suscribe una sola vez.
    this.submitting = true;
    const val: any = this.form.value;

    // Tomamos el usuario actual una vez
    const sub = this.user$.subscribe({
      next: async (user: any) => {
        if (!user) {
          this.errorMsg = 'No se detectó usuario autenticado. Por favor inicia sesión.';
          this.submitting = false;
          sub.unsubscribe();
          return;
        }

        const payload: VehiculoPayload = {
          placa: val.placa.trim().toUpperCase(),
          marca: val.marca.trim(),
          modelo: val.modelo.trim(),
          color: val.color?.trim() || null,
          anho: Number(val.anho),
          propietarioUid: user.uid
        };

        this.vehiculosService.crearVehiculo(payload).subscribe({
          next: (res) => {
            // res es el DocumentReference devuelto por addDoc
            this.submitting = false;
            sub.unsubscribe();
            // redirige a pantalla de lista o dashboard
            this.router.navigate(['/panel']);
          },
          error: (err) => {
            console.error(err);
            this.errorMsg = 'Error al registrar el vehículo. Intenta nuevamente.';
            this.submitting = false;
            sub.unsubscribe();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error de autenticación.';
        this.submitting = false;
        sub.unsubscribe();
      }
    });
  }

  volver() {
    this.router.navigate(['/panel']);
  }
}