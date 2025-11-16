import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estado-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-orden.html',
  styleUrls: ['./estado-orden.css']
})
export class EstadoOrdenComponent implements OnInit {

  ordenes$!: Observable<OrdenPayload[]>;

  constructor(
    private ordenesService: OrdenesService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.user$.subscribe((user: User | null) => {

      if (user) {
        this.ordenes$ = this.ordenesService.obtenerOrdenesUsuario(user.uid);
      }

    });

  }

  volver() {
    this.router.navigate(['/panel']);
  }

}

