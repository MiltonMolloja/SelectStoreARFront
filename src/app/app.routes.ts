import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { PublicLayoutComponent } from './layouts/public-layout.component';

export const routes: Routes = [
  // --- Público con Header + Footer ---
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then(m => m.LandingComponent),
        title: 'SelectStoreAR — Productos importados bajo pedido',
      },
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
        title: 'Catálogo | SelectStoreAR',
      },
      {
        path: 'categoria/:slug',
        loadComponent: () =>
          import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      {
        path: 'producto/:slug',
        loadComponent: () =>
          import('./features/product-detail/product-detail.component').then(
            m => m.ProductDetailComponent,
          ),
      },
      {
        path: 'buscar',
        loadComponent: () =>
          import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
        title: 'Buscar | SelectStoreAR',
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./features/cart/cart.component').then(m => m.CartComponent),
        title: 'Carrito | SelectStoreAR',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then(m => m.LoginComponent),
        title: 'Iniciar sesión | SelectStoreAR',
      },
    ],
  },

  // --- Admin (layout propio) ---
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // --- 404 (sin layout para pantalla completa) ---
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 | SelectStoreAR',
  },
];
