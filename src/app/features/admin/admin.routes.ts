import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Dashboard | Admin | SelectStoreAR',
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./products/product-list.component').then(m => m.ProductListComponent),
        title: 'Productos | Admin | SelectStoreAR',
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./products/product-form.component').then(m => m.ProductFormComponent),
        title: 'Nuevo Producto | Admin | SelectStoreAR',
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./products/product-form.component').then(m => m.ProductFormComponent),
        title: 'Editar Producto | Admin | SelectStoreAR',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./categories/category-list.component').then(m => m.CategoryListComponent),
        title: 'Categorías | Admin | SelectStoreAR',
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./orders/order-list.component').then(m => m.OrderListComponent),
        title: 'Pedidos | Admin | SelectStoreAR',
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./config/admin-config.component').then(m => m.AdminConfigComponent),
        title: 'Configuración | Admin | SelectStoreAR',
      },
    ],
  },
];
