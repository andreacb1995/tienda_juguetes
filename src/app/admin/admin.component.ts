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
export class AdminComponent implements OnInit {
  isLoggedIn: boolean = false; 

  constructor(    
    private navegacionService: NavegacionService,
    private authService: AuthService,
    private router: Router
  ) {
    
  }
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });  }

  volverAInicio() {
    this.navegacionService.irAPrincipal();
  }

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