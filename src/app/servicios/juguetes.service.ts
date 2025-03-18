import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Juguete {
  _id: string;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  edad_recomendada: string;
  dimensiones: string;
  marca: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class JuguetesService {
  private apiUrl = 'https://tienda-juguetes-back.vercel.app/api';
  private httpOptions = {
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getNovedades() {
    return this.http.get<Juguete[]>(`${this.apiUrl}/novedades`, this.httpOptions);
  }

  getJuguetesPorCategoria(categoria: string) {
    const endpoint = categoria === 'novedades' ? 'novedades' :
                    categoria === 'puzles' ? 'puzzles' :
                    categoria === 'creatividad' ? 'juegos-creatividad' :
                    categoria === 'madera' ? 'juegos-madera' :
                    'juegos-mesa';
    
    return this.http.get<Juguete[]>(`${this.apiUrl}/${endpoint}`, this.httpOptions);
  }
}