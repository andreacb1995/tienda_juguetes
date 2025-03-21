// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminProductosComponent } from '../admin-productos/admin-productos.component';
import { AdminPedidosComponent } from '../admin-pedidos/admin-pedidos.component';
import { NavegacionService } from '../services/navegacion.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AdminProductosComponent,
    AdminPedidosComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

// Componente de administración de productos y pedidos
export class AdminComponent implements OnInit {
  isLoggedIn: boolean = false; 
  
  constructor(    
    private navegacionService: NavegacionService,
    private authService: AuthService,
    private router: Router
  ) {
    
  }  
  // Método del ciclo de vida OnInit, se ejecuta al inicializar el componente
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });  
  }

  // Método para volver a la página principal
  volverAInicio() {
    this.navegacionService.irAPrincipal();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}