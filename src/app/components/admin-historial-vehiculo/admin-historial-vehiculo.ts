import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-historial-vehiculo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-historial-vehiculo.html',
  styleUrls: ['./admin-historial-vehiculo.css']
})
export class AdminHistorialVehiculoComponent implements OnInit {

  vehiculoId!: string;
  historial$!: Observable<OrdenPayload[]>;

  constructor(
    private route: ActivatedRoute,
    private ordenesService: OrdenesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehiculoId = this.route.snapshot.paramMap.get("id")!;
    this.historial$ = this.ordenesService.obtenerOrdenesPorVehiculo(this.vehiculoId);
  }

  volver() {
    this.router.navigate(['/admin/historial/:id']);
  }
}
