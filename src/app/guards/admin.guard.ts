/* Importación de los servicios necesarios */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* Guard para verificar si el usuario es administrador */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /* Método para verificar si el usuario es administrador */
  canActivate(): boolean {
    if (this.authService.esAdmin()) {
      return true;
    }
        
    this.router.navigate(['/']);
    return false;
  }
} 