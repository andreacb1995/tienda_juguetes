import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

/* Servicio de carrito */   
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  private mostrarCarritoSubject = new BehaviorSubject<boolean>(false);
  
  private apiUrl = environment.apiUrl;
  
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

  private get storageKey(): string {
    return this.usuarioActual ? 
      `${this.storageKeyBase}_${this.usuarioActual.id}` : 
      this.storageKeyBase;
  }

  /* Método para cargar el carrito inicial */
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

  /* Método para guardar el carrito */
  private guardarCarrito(carrito: any[]) {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(carrito));
      this.carritoSubject.next(carrito);
    }
  }

  /* Método para actualizar el stock */
  private actualizarStock(productos: any[]) {
    return this.http.post(`${this.apiUrl}/stock/reservar`, { productos })
      .pipe(
        catchError(error => {
          console.error('Error en actualizarStock:', error);
          throw error;
        })
      );
  }

  /* Método para obtener el stock disponible */
  obtenerStockDisponible(producto: any): number {
    return producto.stock;
  }

  /* Método para agregar un item al carrito */
  agregarItem(producto: any, cantidad: number = 1) {
    if (producto.stock < cantidad) {
      alert('No hay suficiente stock disponible');
      return;
    }

    const carritoActual = this.carritoSubject.value;
    const productoExistente = carritoActual.find(item => 
      item._id === producto._id && item.categoria === producto.categoria
    );

    const productoParaStock = {
      _id: producto._id,
      categoria: producto.categoria,
      cantidad: -cantidad
    };
    
    this.actualizarStock([productoParaStock]).subscribe({
      next: () => {
        if (productoExistente) {
          productoExistente.cantidad += cantidad;
        } else {
          carritoActual.push({ ...producto, cantidad });
        }
        this.carritoSubject.next([...carritoActual]);
        this.guardarCarrito(carritoActual);
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        alert('Error al actualizar el stock. No se pudo añadir al carrito.');
      }
    });
  }

  /* Método para eliminar un item del carrito */
  eliminarItem(producto: any, cantidad: number = 1) {
    const carritoActual = this.carritoSubject.value;
    const productoExistente = carritoActual.find(item => 
      item._id === producto._id && item.categoria === producto.categoria
    );

    if (!productoExistente) return;

    const productoParaStock = {
      _id: producto._id,
      categoria: producto.categoria,
      cantidad: cantidad
    };

    this.actualizarStock([productoParaStock]).subscribe({
      next: () => {
        if (productoExistente.cantidad > cantidad) {
          productoExistente.cantidad -= cantidad;
          this.carritoSubject.next([...carritoActual]);
        } else {
          const nuevoCarrito = carritoActual.filter(item => 
            !(item._id === producto._id && item.categoria === producto.categoria)
          );
          this.carritoSubject.next(nuevoCarrito);
        }
        this.guardarCarrito(this.carritoSubject.value);
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        alert('Error al eliminar el producto. Por favor, inténtelo de nuevo.');
      }
    });
  }

  /* Método para eliminar un item del carrito */
  eliminarDelCarrito(producto: any) {
    const carritoActual = this.carritoSubject.value;
    const productoParaStock = {
      _id: producto._id,
      categoria: producto.categoria, 
      cantidad: producto.cantidad 
    };

    this.actualizarStock([productoParaStock]).subscribe({
      next: () => {
        const nuevoCarrito = carritoActual.filter(item => 
          !(item._id === producto._id && item.categoria === producto.categoria)
        );
        this.carritoSubject.next(nuevoCarrito);
        this.guardarCarrito(nuevoCarrito);
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        alert('Error al eliminar el producto. Por favor, inténtelo de nuevo.');
      }
    });
  }

  /* Método para obtener el total del carrito */
  obtenerTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  /* Método para obtener la cantidad total del carrito */
  obtenerCantidadTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  /* Método para obtener los items del carrito */
  obtenerItems() {
    return this.carrito$;
  }

  /* Método para eliminar todo el carrito */
  eliminarTodoDelCarrito() {
    const carritoActual = this.carritoSubject.value;
    // Devolver todo el stock sumando las cantidades
    this.actualizarStock(
      carritoActual.map(item => ({ ...item, cantidad: item.cantidad }))
    ).subscribe({
      next: () => {
        this.carritoSubject.next([]);
        if (this.isBrowser) {
          localStorage.removeItem(this.storageKey);
        }
      },
      error: (error) => {
        console.error('Error al restaurar el stock:', error);
      }
    });
  }

  /* Método para alternar el carrito lateral */
  toggleCarritoLateral() {
    const estadoActual = this.mostrarCarritoSubject.value;
    this.mostrarCarritoSubject.next(!estadoActual);
  }

  /* Método para mostrar el carrito lateral */
  mostrarCarritoLateral() {
    this.mostrarCarritoSubject.next(true);
  }

  /* Método para ocultar el carrito lateral */
  ocultarCarritoLateral() {
    this.mostrarCarritoSubject.next(false);
  }

  /* Método para vaciar el carrito */
  vaciarCarrito() {
    this.carritoSubject.next([]); 
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey); 
    }
  }
  
}

