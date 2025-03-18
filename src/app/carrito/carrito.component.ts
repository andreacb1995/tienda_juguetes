import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: any[] = [];
  total = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.items$.subscribe(items => {
      this.items = items;
      this.calcularTotal();
    });
  }

  incrementarCantidad(item: any) {
    this.carritoService.incrementarCantidad(item);
  }

  decrementarCantidad(item: any) {
    this.carritoService.decrementarCantidad(item);
  }

  eliminarItem(item: any) {
    this.carritoService.eliminarItem(item);
  }

  calcularTotal() {
    this.total = this.items.reduce((sum, item) => 
      sum + (item.precio * item.cantidad), 0);
  }

  realizarPedido() {
    console.log('Realizando pedido:', this.items);
    // Implementar lógica de pedido
  }
}
