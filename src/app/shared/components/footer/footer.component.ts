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
            <h3 class="text-[18px] font-extrabold text-[var(--color-accent)] mb-2">
              SelectStoreAR
            </h3>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
              Productos importados premium bajo pedido.
              Celulares, consolas, perfumes y mas.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="text-[14px] font-semibold mb-2">Links</h4>
            <ul class="space-y-2 text-[13px] text-[var(--color-text-secondary)]">
              <li><a routerLink="/catalogo" class="hover:text-[var(--color-accent)] transition-colors">Catalogo</a></li>
              <li><a routerLink="/carrito" class="hover:text-[var(--color-accent)] transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-[14px] font-semibold mb-2">Contacto</h4>
            <ul class="space-y-2 text-[13px] text-[var(--color-text-secondary)]">
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
