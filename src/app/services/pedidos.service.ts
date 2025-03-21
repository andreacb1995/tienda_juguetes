import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CarritoService } from './carrito.service';

/* Servicio de pedidos */ 
@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  /* Método para crear un pedido */
  crearPedido(datosPedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/crear`, datosPedido)
      .pipe(
        tap(() => {
          // Limpiamos el carrito solo si el pedido se creó exitosamente
          this.carritoService.eliminarTodoDelCarrito();
        })
      );
  }

  /* Método para obtener los pedidos del usuario */
  obtenerPedidosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/usuario`, {
      withCredentials: true
    });
  }

  /* Método para obtener un pedido por código */
  obtenerPedidoPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/${codigo}`);
  }

  /* Método para obtener todos los pedidos */ 
  obtenerTodosPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`, {
      withCredentials: true
    });
  }

  /* Método para actualizar el estado de un pedido */
  actualizarEstadoPedido(pedidoId: string, estado: 'aceptado' | 'rechazado'): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/pedidos/${pedidoId}/estado`, 
      { estado },
      { withCredentials: true }
    );
  }
}
