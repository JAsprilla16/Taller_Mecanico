import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-vehiculos.html',
  styleUrls: ['./admin-vehiculos.css'],
})
export class AdminVehiculosComponent {
  vehiculos$: Observable<Vehiculo[]>;
  editando: Vehiculo | null = null;

  constructor(private vehiculosService: VehiculosService, private router: Router) {
    this.vehiculos$ = this.vehiculosService.obtenerVehiculos();
  }

  volver() {
    this.router.navigate(['/admin/vehiculos']);
  }

  editar(v: Vehiculo) {
    this.editando = { ...v };
  }

  guardar() {
    if (!this.editando?.id) return;
    this.vehiculosService
      .actualizarVehiculo(this.editando.id, this.editando)
      .then(() => (this.editando = null));
  }

  eliminar(id?: string) {
    if (!id) return;
    if (confirm('¿Eliminar vehículo?')) {
      this.vehiculosService.eliminarVehiculo(id);
    }
  }
}

