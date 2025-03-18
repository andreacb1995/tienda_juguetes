import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ItemCarrito {
  _id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  stock: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsCarrito = new BehaviorSubject<any[]>([]);
  items$ = this.itemsCarrito.asObservable();

  constructor() {
    // Recuperar carrito del localStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.itemsCarrito.next(JSON.parse(carritoGuardado));
    }
  }

  private actualizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.itemsCarrito.value));
  }

  agregarItem(item: any) {
    const items = this.itemsCarrito.value;
    const itemExistente = items.find(i => i._id === item._id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < item.stock) {
        itemExistente.cantidad++;
        this.itemsCarrito.next(items);
      }
    } else {
      items.push({...item, cantidad: 1});
      this.itemsCarrito.next(items);
    }
    
    this.actualizarLocalStorage();
  }

  incrementarCantidad(item: ItemCarrito) {
    const items = this.itemsCarrito.value;
    const itemExistente = items.find(i => i._id === item._id);
    
    if (itemExistente && itemExistente.cantidad < item.stock) {
      itemExistente.cantidad++;
      this.itemsCarrito.next(items);
      this.actualizarLocalStorage();
    }
  }

  decrementarCantidad(item: ItemCarrito) {
    const items = this.itemsCarrito.value;
    const itemExistente = items.find(i => i._id === item._id);
    
    if (itemExistente && itemExistente.cantidad > 1) {
      itemExistente.cantidad--;
      this.itemsCarrito.next(items);
      this.actualizarLocalStorage();
    }
  }

  eliminarItem(item: ItemCarrito) {
    const items = this.itemsCarrito.value.filter(i => i._id !== item._id);
    this.itemsCarrito.next(items);
    this.actualizarLocalStorage();
  }

  limpiarCarrito() {
    this.itemsCarrito.next([]);
    localStorage.removeItem('carrito');
  }

  obtenerCantidadTotal() {
    return this.itemsCarrito.value.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerTotal() {
    return this.itemsCarrito.value.reduce((total, item) => 
      total + (item.precio * item.cantidad), 0);
  }
}
