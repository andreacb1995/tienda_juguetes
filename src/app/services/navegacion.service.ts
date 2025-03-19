import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {
  private categoriaActualSubject = new BehaviorSubject<string>('novedades');
  cambioCategoria$ = this.categoriaActualSubject.asObservable();

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  cambiarCategoria(categoria: string) {
    this.categoriaActualSubject.next(categoria);
  }

  abrirLogin() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      panelClass: 'login-dialog'
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  irAPrincipal() {
    this.router.navigate(['/']);
  }

  irACarrito() {
    this.router.navigate(['/carrito']);
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  obtenerCategoriaActual(): string {
    return this.categoriaActualSubject.value;
  }
}
