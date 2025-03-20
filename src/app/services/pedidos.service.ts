import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearPedido(pedido: any): Observable<any> {
    console.log('Creando pedido:', pedido);
    return this.http.post(`${this.apiUrl}/pedidos/crear`, pedido, { withCredentials: true });
  }

  obtenerPedidosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/usuario`, { withCredentials: true });
  }

  obtenerPedidoPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/${codigo}`);
  }
}
