import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { ProductImage } from '../../../core/models';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Main Image -->
    <div class="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-divider)] mb-3">
      @if (currentImage()) {
        <img [src]="currentImage()!.original"
             [alt]="currentImage()!.altText ?? 'Imagen del producto'"
             class="w-full h-full object-cover" />
      } @else {
        <div class="w-full h-full flex items-center justify-center text-6xl opacity-30">📷</div>
      }
    </div>

    <!-- Thumbnails -->
    @if (images().length > 1) {
      <div class="flex gap-2 overflow-x-auto pb-1">
        @for (img of images(); track img.id; let i = $index) {
          <button
            (click)="selectedIndex.set(i)"
            [class.ring-2]="selectedIndex() === i"
            [class.ring-[var(--color-accent)]]="selectedIndex() === i"
            class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)]
                   hover:opacity-80 transition-opacity"
            [attr.aria-label]="'Ver imagen ' + (i + 1)">
            <img [src]="img.thumbnail" [alt]="img.altText ?? 'Miniatura'" class="w-full h-full object-cover" />
          </button>
        }
      </div>
    }
  `,
})
export class ImageGalleryComponent {
  readonly images = input.required<ProductImage[]>();
  protected readonly selectedIndex = signal(0);

  protected readonly currentImage = computed(() => {
    const imgs = this.images();
    return imgs.length > 0 ? imgs[this.selectedIndex()] : null;
  });
}
