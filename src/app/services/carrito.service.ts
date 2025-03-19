import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  private mostrarCarritoSubject = new BehaviorSubject<boolean>(false);
  
  carrito$ = this.carritoSubject.asObservable();
  mostrarCarrito$ = this.mostrarCarritoSubject.asObservable();
  private isBrowser: boolean;
  private sesionTimeout: any;
  private storageKey: string = 'carritoActual';
  private estadoCarritoActual: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // Cargar el carrito inicial
      this.cargarCarritoInicial();
      this.carrito$.subscribe(carrito => {
        this.estadoCarritoActual = carrito;
      });

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        if (event.url === '/carrito') {
          this.carritoSubject.next(this.estadoCarritoActual);
        }
      });

      // Guardar carrito antes de cerrar la página
      window.addEventListener('beforeunload', () => {
        if (!this.authService.estaAutenticado()) {
          this.guardarCarrito(this.estadoCarritoActual);
        }
      });
    }
  }

  private cargarCarritoInicial() {
    if (this.isBrowser) {
      const carritoGuardado = localStorage.getItem(this.storageKey);
  
      if (carritoGuardado) {
        try {
          const carrito = JSON.parse(carritoGuardado);
          this.carritoSubject.next(carrito);
          this.estadoCarritoActual = carrito;
        } catch (error) {
          console.error('Error al cargar carrito inicial:', error);
          this.carritoSubject.next([]);
          this.estadoCarritoActual = [];
        }
      } else {
        this.carritoSubject.next([]);
        this.estadoCarritoActual = [];
      }
    }
  }
  

  async agregarItem(producto: any) {
    try {
      const carrito = [...this.estadoCarritoActual]; 
      const itemExistente = carrito.find(item => item._id === producto._id);
  
      if (itemExistente) {
        itemExistente.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
  
      this.estadoCarritoActual = [...carrito];  
      this.carritoSubject.next([...this.estadoCarritoActual]); 
      this.guardarCarrito(this.estadoCarritoActual);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  }
  
  
  private guardarCarrito(carrito: any[]) {
    if (this.isBrowser) {
      console.log('Guardando carrito en storage:', carrito);
      if (this.authService.estaAutenticado()) {
        localStorage.setItem('carritoUsuario', JSON.stringify(carrito));
      } else {
        sessionStorage.setItem('carritoAnonimo', JSON.stringify(carrito));
      }
    }
  }

  obtenerCarrito() {
    return this.estadoCarritoActual;
  }

  decrementarCantidad(item: any) {
    const carrito = [...this.estadoCarritoActual];
    const itemExistente = carrito.find(i => i._id === item._id);

    if (itemExistente && itemExistente.cantidad > 1) {
      itemExistente.cantidad -= 1;
      this.carritoSubject.next(carrito);
      this.guardarCarrito(carrito);
    }
  }
  eliminarItem(item: any) {
    console.log('Eliminando item del carrito:', item);
    const carrito = this.carritoSubject.value.filter(i => i._id !== item._id);
    this.carritoSubject.next(carrito);
    this.guardarCarrito(carrito);
    console.log('Estado del carrito después de eliminar:', carrito);
  }
  
  obtenerTotal() {
    const total = this.estadoCarritoActual.reduce(
      (total, item) => total + (item.precio * item.cantidad), 
      0
    );
    return total;
  }

  obtenerCantidadTotal() {
    const cantidad = this.estadoCarritoActual.reduce(
      (total, item) => total + item.cantidad, 
      0
    );
    return cantidad;
  }

  limpiarCarrito() {
    this.carritoSubject.next([]);
    this.estadoCarritoActual = [];
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }
  public actualizarEstadoCarrito() {
    this.carritoSubject.next(this.estadoCarritoActual);
  }
  
  public obtenerEstadoCarrito() {
    return this.carrito$.subscribe(carrito => carrito);
  }
  
  toggleCarritoLateral() {
    const estadoActual = this.mostrarCarritoSubject.value;
    this.mostrarCarritoSubject.next(!estadoActual);
    console.log('Toggle carrito lateral:', !estadoActual);
  }

  mostrarCarritoLateral() {
    this.mostrarCarritoSubject.next(true);
    console.log('Mostrando carrito lateral');
  }

  ocultarCarritoLateral() {
    this.mostrarCarritoSubject.next(false);
    console.log('Ocultando carrito lateral');
  }

  actualizarCarrito(items: any[]) {
    console.log('Actualizando carrito con items:', items);
    this.carritoSubject.next([...items]);
    this.guardarCarrito(items);
  }
}

