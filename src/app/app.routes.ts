import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Página principal o raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login con Google
  {
  path: 'login',
  loadComponent: () =>
    import('./components/login/login.component').then(
      (m) => m.LoginComponent
    ),
},

  // Panel principal del usuario autenticado
  {
    path: 'panel',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/panel/panel.component').then(
        (m) => m.PanelComponent
      ),
  },

  // Registrar vehículo
  {
    path: 'registrar-vehiculo',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/vehiculos/registrar-vehiculo.component').then(
        (m) => m.RegistrarVehiculoComponent
      ),
  },

  // Solicitar revisión
  {
    path: 'solicitar-revision',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/solicitar-revision/solicitar-revision').then(
        (m) => m.SolicitarRevisionComponent
      ),
  },

  // Estado de orden
  {
    path: 'estado-orden',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/estado-orden/estado-orden').then(
        (m) => m.EstadoOrdenComponent
      ),
  },

  // Historial de servicios
  {
    path: 'historial-servicios',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/historial-servicios/historial-servicios').then(
        (m) => m.HistorialServiciosComponent
      ),
  },

  // Admin Login
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./components/admin/admin').then(m => m.Admin)
  },

  { path: '**', redirectTo: 'login' },
];

