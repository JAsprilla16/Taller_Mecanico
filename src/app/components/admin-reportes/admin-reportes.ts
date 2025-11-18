import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reportes.html',
  styleUrls: ['./admin-reportes.css'],
})
export class AdminReportesComponent implements OnInit {
  year = new Date().getFullYear();
  month = new Date().getMonth(); // 0..11

  ingresosTotal = 0;
  ingresosDetalles: any[] = [];

  vehiculosFrecuentes: Array<{ vehiculoId: string; count: number }> = [];

  serviciosEstado: Array<{ estado: string; count: number }> = [];

  cargandoIngresos = false;
  cargandoVehiculos = false;
  cargandoServicios = false;

  constructor(private reportes: ReportesService, private router: Router) {}

  ngOnInit(): void {
    this.cargarTodos();
  }

  async cargarIngresos() {
    this.cargandoIngresos = true;
    const res = await this.reportes.ingresosPorMes(this.year, this.month);
    this.ingresosTotal = res.total;
    this.ingresosDetalles = res.detalles;
    this.cargandoIngresos = false;
  }

  async cargarVehiculos() {
    this.cargandoVehiculos = true;
    this.vehiculosFrecuentes = await this.reportes.vehiculosMasFrecuentes(10);
    this.cargandoVehiculos = false;
  }

  async cargarServicios() {
    this.cargandoServicios = true;
    // por defecto uso todo el rango (sin fechas)
    this.serviciosEstado = await this.reportes.serviciosPorEstado();
    this.cargandoServicios = false;
  }

  async cargarTodos() {
    await Promise.all([this.cargarIngresos(), this.cargarVehiculos(), this.cargarServicios()]);
  }

  volver() {
    this.router.navigate(['/admin']);
  }
}
