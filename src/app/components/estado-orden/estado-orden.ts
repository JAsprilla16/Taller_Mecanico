import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estado-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-orden.html',
  styleUrls: ['./estado-orden.css']
})
export class EstadoOrdenComponent implements OnInit {
  ordenes$: Observable<OrdenPayload[]>;

  constructor(private ordenesService: OrdenesService) {
    this.ordenes$ = this.ordenesService.obtenerOrdenes();
  }
  

  ngOnInit(): void {}
}
