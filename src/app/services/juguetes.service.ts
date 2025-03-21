import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CarritoService } from './carrito.service';

/* Interfaz de juguete */
export interface Juguete {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock: number;
  coleccion: string;
}

/* Servicio de juguetes */    
@Injectable({
  providedIn: 'root'
})
export class JuguetesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  /* Método para obtener los juguetes por categoría */
  getJuguetesPorCategoria(categoria: string): Observable<Juguete[]> {
    // Si es novedades o está vacío, usar la ruta de novedades
    if (categoria === 'novedades' || !categoria) {
      return this.http.get<Juguete[]>(`${this.apiUrl}/novedades`);
    }

    // Para las demás categorías, usar la ruta específica
    const rutasCategoria: { [key: string]: string } = {
      'puzzles': '/puzzles',
      'juegos-creatividad': '/juegos-creatividad',
      'juegos-mesa': '/juegos-mesa',
      'juegos-madera': '/juegos-madera'
    };

    const ruta = rutasCategoria[categoria];
    if (!ruta) {
      throw new Error(`Categoría no válida: ${categoria}`);
    }

    return this.http.get<Juguete[]>(`${this.apiUrl}${ruta}`);
  }

  /* Método para actualizar el stock */
  actualizarStock(categoria: string, id: string, stock: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/productos/${categoria}/${id}/stock`, 
      { stock },
      { withCredentials: true }
    );
  }

  /* Método para agregar un juguete */
  agregarJuguete(juguete: any): Observable<any> {
    return this.http.post(
        `${this.apiUrl}/productos/nuevo`, 
        juguete, 
        { withCredentials: true }
    );
  }
}