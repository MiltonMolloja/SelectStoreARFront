import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Público — SSR landing
  { path: '', renderMode: RenderMode.Client },

  // Público — SSR para SEO
  { path: 'catalogo', renderMode: RenderMode.Server },
  { path: 'categoria/:slug', renderMode: RenderMode.Server },
  { path: 'producto/:slug', renderMode: RenderMode.Server },
  { path: 'buscar', renderMode: RenderMode.Server },

  // Público — CSR
  { path: 'carrito', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'auth/**', renderMode: RenderMode.Client },
  { path: 'perfil', renderMode: RenderMode.Client },
  { path: 'mis-pedidos', renderMode: RenderMode.Client },
  { path: 'mis-pedidos/:id', renderMode: RenderMode.Client },

  // Admin — CSR
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
