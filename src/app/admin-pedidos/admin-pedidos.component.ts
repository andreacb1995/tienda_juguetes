import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PedidosService } from '../services/pedidos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: any[] = [];
  cargando = false;
  error = '';

  constructor(private pedidosService: PedidosService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidosService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {

        // Redondear el total de cada pedido a dos decimales
        this.pedidos = pedidos.map(pedido => {
          pedido.total = parseFloat(pedido.total.toFixed(2)); // Redondea a dos decimales
          return pedido;
        });
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los pedidos';
        this.cargando = false;
      }
    });
  }

  actualizarEstadoPedido(pedidoId: string, estado: 'aceptado' | 'rechazado') {
    this.pedidosService.actualizarEstadoPedido(pedidoId, estado).subscribe({
      next: () => {
        this.cargarPedidos();
        this.mostrarMensajeExito(`Pedido ${estado} correctamente`); // Mensaje de éxito
      },
      error: (error) => {
        this.mostrarMensajeError('Error al actualizar el estado del pedido'); // Mensaje de error
      }
    });
  }

  // Método para mostrar mensajes de éxito
  mostrarMensajeExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, 
      panelClass: ['snackbar-exito'], 
    });
  }

  // Método para mostrar mensajes de error
  mostrarMensajeError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, 
      panelClass: ['snackbar-error'], 
    });
  }

} 