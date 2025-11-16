import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, OrdenPayload} from '../../services/ordenes.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-servicios.html',
  styleUrls: ['./historial-servicios.css']
})


export class HistorialServiciosComponent implements OnInit {
  historial$: Observable<OrdenPayload[]>;

  constructor(private ordenesService: OrdenesService, private router: Router) {
    this.historial$ = this.ordenesService.obtenerHistorial();
  }

  ngOnInit(): void {}

  volver() {
    this.router.navigate(['/panel']);
  }


}

