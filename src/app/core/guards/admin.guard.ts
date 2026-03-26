import { CanActivateFn } from '@angular/router';

// TODO: Implementar con AuthService real en Sprint 7
export const adminGuard: CanActivateFn = () => {
  // Placeholder: en Sprint 7 se implementa con JWT + rol admin
  // Por ahora permite acceso para desarrollo
  return true;
};
