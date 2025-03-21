/* Importaciones de Angular */  
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { NavegacionService } from '../services/navegacion.service';
import { AuthService } from '../services/auth.service';
import { CarritoService } from '../services/carrito.service';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})

export class CabeceraComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cantidadCarrito: number = 0;
  itemsCarrito: any[] = [];

  /* Constructor de la cabecera de la página */
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private navegacionService: NavegacionService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  /* Método de inicialización de la cabecera de la página */
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );  

    this.authService.usuario$.subscribe(usuario => {
      this.isAdmin = usuario?.rol === 'admin';
    });

    this.carritoService.carrito$.subscribe(carrito => {
      this.itemsCarrito = carrito;
      this.actualizarCarrito();
    });
  }

  /* Método para ir a la página principal */
  irAPrincipal() {
    this.navegacionService.cambiarCategoria('novedades');
  }

  /* Método para ir al perfil del usuario */
  irAPerfil() {
    if (this.isLoggedIn && !this.isAdmin) {
      this.navegacionService.irAPerfil();
    }
  }

  /* Método para ir a la página de administración */
  irAAdmin() {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    }
  }

  /* Método para abrir el diálogo de inicio de sesión */
  abrirLogin() {
    this.navegacionService.abrirLogin();
  }

  /* Método para abrir el diálogo de registro */
  abrirRegistro() {
    this.dialog.open(RegistroComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'registro-dialog'
    });
  }

  /* Método para cerrar la sesión del usuario */
  cerrarSesion() {
    this.authService.logout().subscribe();
    this.abrirLogin();
  }

  /* Método para ir al carrito de compras */
  irACarrito() {
    if (!this.isAdmin) {
      this.navegacionService.irACarrito();
    }
  }

  /* Método para actualizar el carrito de compras */
  actualizarCarrito() {
    this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
  }
}
