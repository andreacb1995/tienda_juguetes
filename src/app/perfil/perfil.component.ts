import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { PedidosService } from '../services/pedidos.service';
import { NavegacionService } from '../services/navegacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  pedidos: any[] = [];

  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService,
    private navegacionService: NavegacionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener datos del usuario
    this.authService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
          this.cargarPedidos();
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
    });
  }

  async cargarPedidos() {
    if (!this.usuario) return;
    
    try {
      const pedidos = await this.pedidosService.obtenerPedidosUsuario().toPromise();
      this.pedidos = pedidos || [];
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  }

  volverAInicio() {
    this.navegacionService.irAPrincipal();
  }

  formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString();
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
