import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  constructor(private http: HttpClient) { }

  getPedidosUsuario() {
    return this.http.get<any[]>(`${environment.apiUrl}/pedidos`);
  }

  realizarPedido(pedido: any) {
    return this.http.post(`${environment.apiUrl}/pedidos`, pedido);
  }
}
