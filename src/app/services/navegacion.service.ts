import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

/* Servicio de navegación */
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

  /* Método para cambiar la categoría */
  cambiarCategoria(categoria: string) {
    this.categoriaActualSubject.next(categoria);
  }

  /* Método para abrir el login */
  abrirLogin() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      panelClass: 'login-dialog'
    });
  }

  /* Método para ir al registro */
  irARegistro() {
    this.router.navigate(['/registro']);
  }

  /* Método para ir a la página principal */
  irAPrincipal() {
    this.router.navigate(['/']);
  }

  /* Método para ir al carrito */
  irACarrito() {
    this.router.navigate(['/carrito']);
  }

  /* Método para ir al perfil */
  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  /* Método para ir al administrador */
  irAAdmin() {
    this.router.navigate(['/admin']);
  }

  /* Método para ir a la página de creación de juguete */
  IraCrearJuguete() {
    this.router.navigate(['/crear-juguete']);
  }
  
  obtenerCategoriaActual(): string {
    return this.categoriaActualSubject.value;
  }
}
