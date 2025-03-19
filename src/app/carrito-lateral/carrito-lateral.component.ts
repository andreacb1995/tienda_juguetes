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

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.calcularTotal();
    });

    this.carritoService.mostrarCarrito$.subscribe(mostrar => {
      this.mostrarCarrito = mostrar;
    });
  }

  calcularTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  eliminarProducto(item: any) {
    this.carritoService.eliminarItem(item);
  }

  decrementarCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCarrito();
    }
  }

  incrementarCantidad(item: any) {
    item.cantidad++;
    this.actualizarCarrito();
  }

  actualizarCarrito() {
    this.calcularTotal();
    // Actualizar el carrito en el servicio
    this.carritoService.actualizarCarrito(this.items);
  }

  realizarPedido() {
    this.navegacionService.irACarrito();
  }

  toggleCarrito() {
    this.carritoService.toggleCarritoLateral();
  }
} 