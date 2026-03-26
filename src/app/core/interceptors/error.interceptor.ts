import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toast.error('Error de conexión. Verificá tu internet.');
      } else if (error.status === 401) {
        toast.error('Sesión expirada. Iniciá sesión nuevamente.');
      } else if (error.status === 403) {
        toast.error('No tenés permisos para esta acción.');
      } else if (error.status === 404) {
        // Silently handle 404s — components handle their own not-found states
      } else if (error.status === 422) {
        const problem = error.error as ProblemDetails;
        toast.error(problem?.detail ?? 'No se pudo procesar la solicitud.');
      } else if (error.status === 429) {
        toast.error('Demasiadas solicitudes. Esperá un momento.');
      } else if (error.status >= 500) {
        toast.error('Error del servidor. Intentá de nuevo más tarde.');
      } else if (error.status >= 400) {
        const problem = error.error as ProblemDetails;
        if (problem?.errors) {
          const firstError = Object.values(problem.errors)[0]?.[0];
          if (firstError) {
            toast.error(firstError);
          }
        } else if (problem?.detail) {
          toast.error(problem.detail);
        }
      }

      return throwError(() => error);
    }),
  );
};
