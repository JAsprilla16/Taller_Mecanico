import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';

@Component({
  selector: 'app-factura-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-orden.html',
  styleUrls: ['./factura-orden.css']
})
export class FacturaOrdenComponent implements OnInit {

  ordenId!: string;
  orden!: OrdenPayload | null;
  vehiculo!: Vehiculo | null;

  cargando = true;

  totalRepuestos = 0;
  totalFinal = 0;

  constructor(
    private route: ActivatedRoute,
    private ordenesService: OrdenesService,
    private vehiculosService: VehiculosService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.ordenId = this.route.snapshot.paramMap.get('id')!;

    // Obtener la orden
    const snap = await this.ordenesService.obtenerOrdenPorId(this.ordenId);
    if (!snap.exists()) return;

    this.orden = snap.data() as OrdenPayload;

    // Obtener datos del vehículo
    const vehiculoSnap = await this.vehiculosService.obtenerVehiculoPorId(this.orden.vehiculoId);
    this.vehiculo = vehiculoSnap.exists() ? vehiculoSnap.data() as Vehiculo : null;

    // Calcular costos
    const repuestos = this.orden.repuestos ?? [];
    this.totalRepuestos = repuestos.reduce(
      (sum, r) => sum + (r.precio * r.cantidad),
      0
    );

    this.totalFinal = this.totalRepuestos + (this.orden.manoObra ?? 0);

    this.cargando = false;
  }

  volver() {
    this.router.navigate(['/admin/ordenes']); 
  }
}


