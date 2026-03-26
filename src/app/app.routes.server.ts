import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Público — SSR landing (Prerender cuando haya API disponible)
  { path: '', renderMode: RenderMode.Client },

  // Público — SSR para SEO
  { path: 'catalogo', renderMode: RenderMode.Server },
  { path: 'categoria/:slug', renderMode: RenderMode.Server },
  { path: 'producto/:slug', renderMode: RenderMode.Server },
  { path: 'buscar', renderMode: RenderMode.Server },

  // Público — CSR (no necesita SEO)
  { path: 'carrito', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },

  // Admin — CSR
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
