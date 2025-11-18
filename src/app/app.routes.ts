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

  // Factura de orden
  {
  path: 'factura/:id',
  canActivate: [AuthGuard],
  loadComponent: () =>
    import('./components/factura-orden/factura-orden')
      .then(m => m.FacturaOrdenComponent)
},

  // Admin Panel
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./components/admin-panel/admin-panel').then(m => m.Admin)
  },

  // Admin Ordenes
  {
  path: 'admin/ordenes',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./components/admin-ordenes/admin-ordenes')
      .then(m => m.AdminOrdenesComponent)
},

  // Admin Editar Orden
  {
  path: 'admin/orden/:id',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./components/admin-editar-orden/admin-editar-orden')
      .then(m => m.AdminEditarOrdenComponent)
},

  // Admin Historial Vehículo
  {
  path: 'admin/historial/:id',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./components/admin-historial-vehiculo/admin-historial-vehiculo')
      .then(m => m.AdminHistorialVehiculoComponent)
},

  // Admin Vehículos
  {
  path: 'admin/vehiculos',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./components/admin-vehiculos/admin-vehiculos').then(
      m => m.AdminVehiculosComponent
    ),
},

  //Admin Reportes
  {
    path: 'admin/reportes',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./components/admin-reportes/admin-reportes').then(
        m => m.AdminReportesComponent
      )
},

//Admin Factura Orden
{
  path: 'admin/factura/:id',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./components/factura-orden/factura-orden')
      .then(m => m.FacturaOrdenComponent)
},

// Ruta comodín para redirigir a login si no se encuentra la ruta
  { path: '**', redirectTo: 'login' },
];

