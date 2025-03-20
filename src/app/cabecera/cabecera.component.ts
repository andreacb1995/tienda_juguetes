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
  cantidadCarrito: number = 0;
  isLoggedIn = false;
  itemsCarrito: any[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private navegacionService: NavegacionService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );

    this.carritoService.carrito$.subscribe(carrito => {
      this.itemsCarrito = carrito;
      this.actualizarCarrito();
    });
  }

  irAPrincipal() {
    this.navegacionService.cambiarCategoria('novedades');
  }

  irAPerfil() {
    if (this.isLoggedIn) {
      this.navegacionService.irAPerfil();
    } 
  }

  abrirLogin() {
    this.navegacionService.abrirLogin();
  }

  abrirRegistro() {
    this.dialog.open(RegistroComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'registro-dialog'
    });
  }

  irACarrito() {
    this.navegacionService.irACarrito();
  }
  
  actualizarCarrito() {
    this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
  }
  
}
