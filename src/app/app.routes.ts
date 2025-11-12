import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./components/panel/panel.component').then(
        (m) => m.PanelComponent
      ),
  },

  // Registrar vehículo
  {
    path: 'registrar-vehiculo',
    loadComponent: () =>
      import('./components/vehiculos/registrar-vehiculo.component').then(
        (m) => m.RegistrarVehiculoComponent
      ),
  },

  // Solicitar revisión
  {
    path: 'solicitar-revision',
    loadComponent: () =>
      import('./components/solicitar-revision/solicitar-revision').then(
        (m) => m.SolicitarRevisionComponent
      ),
  },

  // Estado de orden
  {
    path: 'solicitar-revision',
    loadComponent: () =>
      import('./components/solicitar-revision/solicitar-revision').then(
        (m) => m.SolicitarRevisionComponent
      ),
  },

  {
    path: 'estado-orden',
    loadComponent: () =>
      import('./components/estado-orden/estado-orden').then(
        (m) => m.EstadoOrdenComponent
      ),
  },

  {
    path: 'historial-servicios',
    loadComponent: () =>
      import('./components/historial-servicios/historial-servicios').then(
        (m) => m.HistorialServiciosComponent
      ),
  },

  // Redirección si la ruta no existe
  { path: '**', redirectTo: 'login' },
];

