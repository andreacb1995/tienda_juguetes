import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PedidosService } from '../services/pedidos.service';

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

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidosService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
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
        alert(`Pedido ${estado} correctamente`);
      },
      error: (error) => {
        alert('Error al actualizar el estado del pedido');
      }
    });
  }
} 