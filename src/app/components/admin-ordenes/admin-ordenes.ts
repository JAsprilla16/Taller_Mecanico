import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-ordenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-ordenes.html',
  styleUrls: ['./admin-ordenes.css']
})
export class AdminOrdenesComponent implements OnInit {

  ordenes$: Observable<OrdenPayload[]>;
  filtroEstado: string = 'Todos';

  constructor(
    private ordenesService: OrdenesService,
    private router: Router
  ) {
    this.ordenes$ = this.ordenesService.obtenerTodasLasOrdenes();
  }

  ngOnInit(): void {}

  filtrar(estado: string) {
    this.filtroEstado = estado;

    if (estado === 'Todos') {
      this.ordenes$ = this.ordenesService.obtenerTodasLasOrdenes();
    } else {
      this.ordenes$ = this.ordenesService.obtenerOrdenesPorEstado(estado);
    }
  }

  verOrden(id: string) {
    this.router.navigate(['/admin/orden', id]);
  }
  
  verFactura(id: string) {
  this.router.navigate(['/admin/factura', id]);
}


  volver() {
  this.router.navigate(['/admin']);
}

}
