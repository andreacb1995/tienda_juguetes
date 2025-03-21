import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

/* Guard para verificar si el usuario está autenticado */ 
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /* Método para verificar si el usuario está autenticado */
  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
}; 