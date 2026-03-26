import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Dashboard | Admin | SelectStoreAR',
  },
  // TODO Sprint 1: Productos CRUD
  // TODO Sprint 1: Categorías CRUD
  // TODO Sprint 6: Pedidos
  // TODO Sprint 3: Configuración
];
