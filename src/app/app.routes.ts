import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // --- Público (SSR para SEO) ---
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

  // --- Público (CSR — no necesita SEO) ---
  {
    path: 'carrito',
    loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Carrito | SelectStoreAR',
  },

  // --- Auth ---
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent),
    title: 'Iniciar sesión | SelectStoreAR',
  },

  // --- Admin (CSR — lazy loaded) ---
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // --- 404 ---
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 | SelectStoreAR',
  },
];
