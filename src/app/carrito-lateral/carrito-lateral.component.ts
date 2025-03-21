import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { NavegacionService } from '../services/navegacion.service';

@Component({
  selector: 'app-carrito-lateral',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-lateral.component.html',
  styleUrls: ['./carrito-lateral.component.css']
})
export class CarritoLateralComponent implements OnInit {
  items: any[] = [];
  total: number = 0;
  mostrarCarrito = false;

  constructor(
    private carritoService: CarritoService,
    private navegacionService: NavegacionService
  ) {}

  /* Método para inicializar el carrito */
  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.calcularTotal();
    });

    this.carritoService.mostrarCarrito$.subscribe(mostrar => {
      this.mostrarCarrito = mostrar;
    });
  }

  /* Método para decrementar la cantidad del producto en el carrito */
  async decrementarCantidad(item: any) {
    if (item.cantidad > 1) {
      try {
        // Decrementar la cantidad del producto en el carrito
        await this.carritoService.eliminarItem(item,1);
      } catch (error) {
        console.error('Error al decrementar cantidad:', error);
      }
    }
  }

  /* Método para incrementar la cantidad del producto en el carrito */
  async incrementarCantidad(item: any) {
    const cantidadEnCarrito = item.cantidad || 0;  
    const stockDisponible = item.stock;

    // Verificar si la cantidad en el carrito ya alcanzó el stock disponible
    if (cantidadEnCarrito >= stockDisponible) {
      console.log('No puedes agregar más de lo que hay en stock.');
      return; // Si ya se alcanzó el stock, no se incrementa la cantidad
    }
    try { 
      // Incrementar la cantidad del producto en el carrito
      await this.carritoService.agregarItem(item, 1);
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
    }
  }

  /* Método para eliminar el producto del carrito */
  async eliminarProducto(item: any) {
    try {
      await this.carritoService.eliminarItem(item, item.cantidad);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  /* Método para calcular el total del carrito */
  calcularTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  /* Método para actualizar el carrito */
  actualizarCarrito() {
    this.calcularTotal();
  }

  /* Método para realizar el pedido */
  realizarPedido() {
    this.navegacionService.irACarrito();
  }

  /* Método para abrir el carrito lateral */
  toggleCarrito() {
    this.carritoService.toggleCarritoLateral();
  }

  
} 