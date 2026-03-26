import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { AdminCategory } from '../models/admin.models';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/admin/productos"
           class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          ← Volver
        </a>
        <h1 class="text-3xl font-bold">{{ isEditing() ? 'Editar producto' : 'Nuevo producto' }}</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium mb-1.5">Nombre *</label>
          <input id="name" formControlName="name" type="text"
                 placeholder="Samsung Galaxy S26 Ultra 256GB"
                 class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
          @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <p class="text-xs text-[var(--color-error)] mt-1">El nombre es obligatorio</p>
          }
        </div>

        <!-- Brand + Category -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="brand" class="block text-sm font-medium mb-1.5">Marca</label>
            <input id="brand" formControlName="brand" type="text" placeholder="Samsung"
                   class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
          </div>
          <div>
            <label for="categoryId" class="block text-sm font-medium mb-1.5">Categoría *</label>
            <select id="categoryId" formControlName="categoryId"
                    class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
              <option value="">Seleccionar categoría</option>
              @for (cat of categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.parentName ? cat.parentName + ' > ' : '' }}{{ cat.name }}</option>
              }
            </select>
            @if (form.get('categoryId')?.invalid && form.get('categoryId')?.touched) {
              <p class="text-xs text-[var(--color-error)] mt-1">La categoría es obligatoria</p>
            }
          </div>
        </div>

        <!-- Price + Markup -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="basePriceUsd" class="block text-sm font-medium mb-1.5">Precio base (USD) *</label>
            <input id="basePriceUsd" formControlName="basePriceUsd" type="number" step="0.01" min="0.01"
                   placeholder="1000.00"
                   class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
            @if (form.get('basePriceUsd')?.invalid && form.get('basePriceUsd')?.touched) {
              <p class="text-xs text-[var(--color-error)] mt-1">El precio debe ser mayor a 0</p>
            }
          </div>
          <div>
            <label for="markupPercentage" class="block text-sm font-medium mb-1.5">Markup (%)</label>
            <input id="markupPercentage" formControlName="markupPercentage" type="number" step="0.01" min="0" max="500"
                   placeholder="25"
                   class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">Dejar vacío para usar el markup de la categoría o global</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium mb-1.5">Descripción</label>
          <textarea id="description" formControlName="description" rows="4"
                    placeholder="Descripción del producto..."
                    class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-y">
          </textarea>
        </div>

        <!-- Specifications -->
        <div>
          <span class="block text-sm font-medium mb-1.5">Especificaciones</span>
          <div class="space-y-2">
            @for (spec of specEntries(); track $index) {
              <div class="flex gap-2">
                <input type="text" [value]="spec.key" placeholder="Clave (ej: Pantalla)"
                       (input)="onSpecKeyChange($index, $event)"
                       class="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm
                              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                <input type="text" [value]="spec.value" placeholder="Valor (ej: 6.9&quot;)"
                       (input)="onSpecValueChange($index, $event)"
                       class="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm
                              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                <button type="button" (click)="removeSpec($index)"
                        class="px-2 text-[var(--color-error)] hover:bg-red-50 rounded transition-colors">
                  ✕
                </button>
              </div>
            }
          </div>
          <button type="button" (click)="addSpec()"
                  class="mt-2 text-sm text-[var(--color-accent)] hover:underline">
            + Agregar especificación
          </button>
        </div>

        <!-- Image Upload -->
        <div>
          <span class="block text-sm font-medium mb-1.5">Imágenes</span>
          <div
            class="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center
                   hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            (click)="fileInput.click()"
            (keydown.enter)="fileInput.click()"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
            role="button"
            tabindex="0"
            aria-label="Subir imágenes">
            <p class="text-[var(--color-text-secondary)]">
              Arrastrá imágenes acá o hacé click para seleccionar
            </p>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">JPEG, PNG o WebP · Máximo 10 imágenes</p>
          </div>
          <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" multiple
                 (change)="onFilesSelected($event)" class="hidden" />

          <!-- Preview -->
          @if (selectedFiles().length > 0) {
            <div class="flex gap-3 mt-4 flex-wrap">
              @for (file of selectedFiles(); track $index) {
                <div class="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-border)]">
                  <img [src]="file.preview" [alt]="file.name" class="w-full h-full object-cover" />
                  <button type="button" (click)="removeFile($index)"
                          class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    ✕
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Status (only on create) -->
        @if (!isEditing()) {
          <div>
            <label for="status" class="block text-sm font-medium mb-1.5">Estado inicial</label>
            <select id="status" formControlName="status"
                    class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
              <option value="draft">Borrador</option>
              <option value="active">Activo (publicar)</option>
            </select>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]">
          <button type="submit" [disabled]="form.invalid || submitting()"
                  class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                         hover:opacity-90 transition-opacity disabled:opacity-50">
            {{ submitting() ? 'Guardando...' : (isEditing() ? 'Guardar cambios' : 'Crear producto') }}
          </button>
          <a routerLink="/admin/productos"
             class="px-6 py-2.5 border border-[var(--color-border)] rounded-lg font-medium
                    hover:bg-[var(--color-surface-hover)] transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditing = signal(false);
  protected readonly submitting = signal(false);
  protected readonly categories = signal<AdminCategory[]>([]);
  protected readonly specEntries = signal<{ key: string; value: string }[]>([]);
  protected readonly selectedFiles = signal<{ file: File; preview: string; name: string }[]>([]);

  protected readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    brand: [''],
    categoryId: ['', Validators.required],
    basePriceUsd: [null, [Validators.required, Validators.min(0.01)]],
    markupPercentage: [null],
    description: [''],
    status: ['draft'],
  });

  private productId: string | null = null;

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.productId = id;
      this.isEditing.set(true);
      this.loadProduct(id);
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const specs: Record<string, string> = {};
    this.specEntries().forEach(s => {
      if (s.key.trim()) specs[s.key.trim()] = s.value.trim();
    });

    if (this.isEditing() && this.productId) {
      this.api.updateProduct(this.productId, {
        ...this.form.value,
        specifications: specs,
      }).subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/admin/productos']);
        },
        error: () => this.submitting.set(false),
      });
    } else {
      const files = this.selectedFiles().map(f => f.file);
      this.api.createProduct({
        ...this.form.value,
        specifications: specs,
      }, files).subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/admin/productos']);
        },
        error: () => this.submitting.set(false),
      });
    }
  }

  // ── Specifications ─────────────────────────────────────────────────────

  protected addSpec(): void {
    this.specEntries.update(s => [...s, { key: '', value: '' }]);
  }

  protected removeSpec(index: number): void {
    this.specEntries.update(s => s.filter((_, i) => i !== index));
  }

  protected onSpecKeyChange(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.specEntries.update(s => s.map((spec, i) => i === index ? { ...spec, key: value } : spec));
  }

  protected onSpecValueChange(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.specEntries.update(s => s.map((spec, i) => i === index ? { ...spec, value } : spec));
  }

  // ── Image Upload ───────────────────────────────────────────────────────

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  protected removeFile(index: number): void {
    this.selectedFiles.update(f => f.filter((_, i) => i !== index));
  }

  private addFiles(files: File[]): void {
    const validFiles = files.filter(f =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    );

    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    this.selectedFiles.update(existing => {
      const combined = [...existing, ...newFiles];
      return combined.slice(0, 10); // Max 10 images
    });
  }

  private loadProduct(id: string): void {
    this.api.getProduct(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          brand: product.brand,
          categoryId: product.categoryId,
          basePriceUsd: product.basePriceUsd,
          markupPercentage: product.markupPercentage,
          description: product.description,
        });

        // Load specifications
        const specs = Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
        this.specEntries.set(specs);

        // Load existing images as previews
        const existingImages = product.images.map(img => ({
          file: null as unknown as File,
          preview: img.thumbnail,
          name: `image-${img.id}`,
        }));
        this.selectedFiles.set(existingImages);
      },
    });
  }

  private loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });
  }
}
