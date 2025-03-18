import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Juguete {
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class JuguetesService {
  // Actualiza la URL base de tu API
  private apiUrl = 'https://tienda-juguetes-back.vercel.app/api';

  constructor(private http: HttpClient) { }

  getJuguetesPorCategoria(categoria: string): Observable<Juguete[]> {
    // Mapeo de categorías a endpoints
    const endpointMap: { [key: string]: string } = {
      'novedades': '/novedades',
      'puzles': '/puzzles',
      'creatividad': '/juegos-creatividad',
      'juegos-mesa': '/juegos-mesa',
      'madera': '/juegos-madera'
    };

    const endpoint = endpointMap[categoria];
    if (!endpoint) {
      throw new Error(`Categoría no válida: ${categoria}`);
    }

    return this.http.get<Juguete[]>(`${this.apiUrl}${endpoint}`);
  }
}