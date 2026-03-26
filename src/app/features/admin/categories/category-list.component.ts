import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { AdminCategory } from '../models/admin.models';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Categorías</h1>
        <button (click)="showForm.set(true)"
                class="px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          + Nueva categoría
        </button>
      </div>

      <!-- Form (create/edit) -->
      @if (showForm()) {
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">{{ editingId() ? 'Editar categoría' : 'Nueva categoría' }}</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="catName" class="block text-sm font-medium mb-1">Nombre *</label>
                <input id="catName" formControlName="name" type="text" placeholder="Celulares"
                       class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              </div>
              <div>
                <label for="catParent" class="block text-sm font-medium mb-1">Categoría padre</label>
                <select id="catParent" formControlName="parentId"
                        class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option [value]="null">Ninguna (raíz)</option>
                  @for (cat of parentCategories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="catMarkup" class="block text-sm font-medium mb-1">Markup por defecto (%)</label>
                <input id="catMarkup" formControlName="defaultMarkup" type="number" step="0.01" min="0" max="500"
                       placeholder="25"
                       class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              </div>
              <div>
                <label for="catOrder" class="block text-sm font-medium mb-1">Orden</label>
                <input id="catOrder" formControlName="sortOrder" type="number" min="0"
                       class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              </div>
            </div>
            <div class="flex gap-3">
              <button type="submit" [disabled]="form.invalid"
                      class="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium
                             hover:opacity-90 disabled:opacity-50">
                {{ editingId() ? 'Guardar' : 'Crear' }}
              </button>
              <button type="button" (click)="cancelForm()"
                      class="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-surface-hover)]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th class="px-4 py-3 font-medium">Nombre</th>
              <th class="px-4 py-3 font-medium">Padre</th>
              <th class="px-4 py-3 font-medium">Markup</th>
              <th class="px-4 py-3 font-medium">Productos</th>
              <th class="px-4 py-3 font-medium">Orden</th>
              <th class="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of categories(); track cat.id) {
              <tr class="border-b border-[var(--color-divider)] hover:bg-[var(--color-surface-hover)]">
                <td class="px-4 py-3 font-medium">{{ cat.name }}</td>
                <td class="px-4 py-3 text-[var(--color-text-secondary)]">{{ cat.parentName ?? '—' }}</td>
                <td class="px-4 py-3">{{ cat.defaultMarkup !== null && cat.defaultMarkup !== undefined ? cat.defaultMarkup + '%' : '—' }}</td>
                <td class="px-4 py-3">{{ cat.productCount }}</td>
                <td class="px-4 py-3">{{ cat.sortOrder }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="onEdit(cat)" (keydown.enter)="onEdit(cat)"
                          class="p-1.5 rounded hover:bg-[var(--color-surface-hover)]" title="Editar">✏️</button>
                  @if (cat.productCount === 0) {
                    <button (click)="onDelete(cat)" (keydown.enter)="onDelete(cat)"
                            class="p-1.5 rounded hover:bg-red-50 text-[var(--color-error)]" title="Eliminar">🗑️</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No hay categorías creadas
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CategoryListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);

  protected readonly categories = signal<AdminCategory[]>([]);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    parentId: [null],
    defaultMarkup: [null],
    sortOrder: [0],
  });

  protected readonly parentCategories = signal<AdminCategory[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;
    if (this.editingId()) {
      this.api.updateCategory(this.editingId()!, data).subscribe({
        next: () => { this.cancelForm(); this.loadCategories(); },
      });
    } else {
      this.api.createCategory(data).subscribe({
        next: () => { this.cancelForm(); this.loadCategories(); },
      });
    }
  }

  protected onEdit(cat: AdminCategory): void {
    this.editingId.set(cat.id);
    this.showForm.set(true);
    this.form.patchValue({
      name: cat.name,
      parentId: cat.parentId,
      defaultMarkup: cat.defaultMarkup,
      sortOrder: cat.sortOrder,
    });
    this.parentCategories.set(this.categories().filter(c => c.id !== cat.id));
  }

  protected onDelete(cat: AdminCategory): void {
    if (confirm(`¿Eliminar categoría "${cat.name}"?`)) {
      this.api.deleteCategory(cat.id).subscribe({
        next: () => this.loadCategories(),
      });
    }
  }

  protected cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ sortOrder: 0 });
  }

  private loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.parentCategories.set(cats.filter(c => !c.parentId));
      },
    });
  }
}
