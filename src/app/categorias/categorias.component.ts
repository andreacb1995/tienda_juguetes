import { Component, OnInit } from '@angular/core';
import { JuguetesService, Juguete } from '../servicios/juguestes.service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, HttpClientModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {
  juguetesFiltrados: Juguete[] = [];
  categoriaActual: string = 'novedades';
  error: string = '';

  constructor(private juguetesService: JuguetesService) {}

  ngOnInit() {
    // Cargar novedades por defecto
    this.cambiarContenido('novedades');
  }

  cambiarContenido(categoria: string): void {
    this.categoriaActual = categoria;
    this.error = '';
    
    this.juguetesService.getJuguetesPorCategoria(categoria)
      .subscribe({
        next: (juguetes) => {
          this.juguetesFiltrados = juguetes;
        },
        error: (error) => {
          console.error('Error al cargar juguetes:', error);
          this.error = 'Error al cargar los juguetes. Por favor, intenta de nuevo.';
          this.juguetesFiltrados = [];
        }
      });
  }
  getCategoriaTitle(categoria: string): string {
    switch(categoria) {
      case 'juegos-mesa':
        return 'Mesa';
      default:
        return categoria;
    }
  }
}