import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { Subscription } from 'rxjs';
import { NavegacionService } from '../services/navegacion.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
  items: any[] = [];
  total: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private carritoService: CarritoService,
    private navegacionService: NavegacionService
  ) {}

  ngOnInit() {
    console.log('Inicializando componente Carrito');
    this.subscription.add(
      this.carritoService.carrito$.subscribe(items => {
        console.log('Carrito actualizado en componente:', items);
        this.items = items;
        this.actualizarTotal();
      })
    );
  }

  ngOnDestroy() {
    console.log('Destruyendo componente Carrito');
    this.subscription.unsubscribe();
  }

  actualizarTotal() {
    this.total = this.carritoService.obtenerTotal();
    console.log('Total actualizado en componente:', this.total);
  }

  incrementarCantidad(item: any) {
    console.log('Incrementando cantidad para item:', item);
    this.carritoService.agregarItem(item);
  }

  decrementarCantidad(item: any) {
    console.log('Decrementando cantidad para item:', item);
    this.carritoService.decrementarCantidad(item);
  }

  eliminarItem(item: any) {
    console.log('Eliminando item del carrito:', item);
    this.carritoService.eliminarItem(item);
  }

  limpiarCarrito() {
    console.log('Limpiando carrito');
    this.carritoService.limpiarCarrito();
  }

  realizarPedido() {
    console.log('Realizando pedido:', this.items);
  }

  volverATienda() {
    console.log('Volviendo a la tienda');
    this.navegacionService.irAPrincipal();
  }
  iraLogin(){
    this.navegacionService.abrirLogin();
  }
}
