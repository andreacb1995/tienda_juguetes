import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  private mostrarCarritoSubject = new BehaviorSubject<boolean>(false);
  
  carrito$ = this.carritoSubject.asObservable();
  mostrarCarrito$ = this.mostrarCarritoSubject.asObservable();
  private isBrowser: boolean;
  private storageKeyBase: string = 'carritoActual';
  private usuarioActual: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.authService.usuario$.subscribe(usuario => {
        this.usuarioActual = usuario;
        this.cargarCarritoInicial();
      });
    }
  }

  private obtenerTodosLosCarritos(): any[] {
    const carritos: any[] = [];
    if (this.isBrowser) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKeyBase)) {
          try {
            const carrito = JSON.parse(localStorage.getItem(key) || '[]');
            carritos.push(...carrito);
          } catch (error) {
            console.error('Error al parsear carrito:', error);
          }
        }
      }
    }
    return carritos;
  }

  private calcularStockDisponible(producto: any): number {
    const todosLosItems = this.obtenerTodosLosCarritos();
    const cantidadTotal = todosLosItems.reduce((total, item) => {
      if (item._id === producto._id && item.categoria === producto.categoria) {
        return total + item.cantidad;
      }
      return total;
    }, 0);
    return producto.stock - cantidadTotal;
  }

  private get storageKey(): string {
    return this.usuarioActual ? 
      `${this.storageKeyBase}_${this.usuarioActual.id}` : 
      this.storageKeyBase;
  }

  private cargarCarritoInicial() {
    if (this.isBrowser) {
      const carritoGuardado = localStorage.getItem(this.storageKey);
      if (carritoGuardado) {
        try {
          const carrito = JSON.parse(carritoGuardado);
          this.carritoSubject.next(carrito);
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
          this.carritoSubject.next([]);
        }
      } else {
        this.carritoSubject.next([]);
      }
    }
  }

  private guardarCarrito(carrito: any[]) {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(carrito));
    }
  }

  obtenerTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  obtenerCantidadTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  agregarItem(producto: any, cantidad: number = 1) {
    const stockDisponible = this.calcularStockDisponible(producto);
    
    if (stockDisponible < cantidad) {
      alert('No hay suficiente stock disponible');
      return;
    }

    const carritoActual = this.carritoSubject.value;
    const productoExistente = carritoActual.find(item => 
      item._id === producto._id && item.categoria === producto.categoria
    );

    if (productoExistente) {
      if (stockDisponible < cantidad) {
        alert('No hay suficiente stock disponible');
        return;
      }
      productoExistente.cantidad += cantidad;
    } else {
      carritoActual.push({ ...producto, cantidad });
    }

    this.carritoSubject.next([...carritoActual]);
    this.guardarCarrito(carritoActual);
  }

  eliminarItem(producto: any, cantidad: number) {
    const carritoActual = this.carritoSubject.value;
    const productoExistente = carritoActual.find(item => 
      item._id === producto._id && item.categoria === producto.categoria
    );

    if (productoExistente) {
      if (productoExistente.cantidad <= cantidad) {
        const nuevoCarrito = carritoActual.filter(item => 
          !(item._id === producto._id && item.categoria === producto.categoria)
        );
        this.carritoSubject.next(nuevoCarrito);
        this.guardarCarrito(nuevoCarrito);
      } else {
        productoExistente.cantidad -= cantidad;
        this.carritoSubject.next([...carritoActual]);
        this.guardarCarrito(carritoActual);
      }
    }
  }

  obtenerStockDisponible(producto: any): number {
    return this.calcularStockDisponible(producto);
  }

  toggleCarritoLateral() {
    const estadoActual = this.mostrarCarritoSubject.value;
    this.mostrarCarritoSubject.next(!estadoActual);
  }

  mostrarCarritoLateral() {
    this.mostrarCarritoSubject.next(true);
  }

  ocultarCarritoLateral() {
    this.mostrarCarritoSubject.next(false);
  }

  obtenerItems() {
    return this.carrito$;
  }

  eliminarTodoDelCarrito() {
    this.carritoSubject.next([]);
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }
}

