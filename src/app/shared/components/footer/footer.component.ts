import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <h3 class="text-lg font-bold text-[var(--color-accent)] mb-3"
                style="font-family: 'Cormorant Garamond', serif">
              SelectStoreAR
            </h3>
            <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Productos importados bajo pedido.
              Celulares, consolas, perfumes y más.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold mb-3 text-sm">Links</h4>
            <ul class="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><a routerLink="/catalogo" class="hover:text-[var(--color-accent)] transition-colors">Catálogo</a></li>
              <li><a routerLink="/carrito" class="hover:text-[var(--color-accent)] transition-colors">Carrito</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-3 text-sm">Contacto</h4>
            <ul class="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>
                <a href="https://wa.me/5493881234567" target="_blank" rel="noopener"
                   class="hover:text-[var(--color-accent)] transition-colors">
                  WhatsApp: +54 388 123-4567
                </a>
              </li>
              <li>
                <a href="https://instagram.com/selectstorear" target="_blank" rel="noopener"
                   class="hover:text-[var(--color-accent)] transition-colors">
                  Instagram: &#64;selectstorear
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
          &copy; {{ currentYear }} SelectStoreAR. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
