import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuguetesService, Juguete } from '../servicios/juguetes.service';

interface ItemCarrito extends Juguete {
  cantidad: number;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  juguetesFiltrados: Juguete[] = [];
  categoriaActual: string = 'novedades';
  error: string = '';
  carritoVisible = false;
  itemsCarrito: ItemCarrito[] = [];
  totalCarrito = 0;

  constructor(private juguetesService: JuguetesService) {
  }

  ngOnInit() {
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
    const titles: { [key: string]: string } = {
      'juegos-mesa': 'Juegos de Mesa',
      'puzles': 'Puzles',
      'creatividad': 'Creatividad',
      'madera': 'Juguetes de Madera',
      'novedades': 'Novedades'
    };
    return titles[categoria] || categoria;
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  agregarAlCarrito(juguete: Juguete) {
    const itemExistente = this.itemsCarrito.find(item => item._id === juguete._id);
    
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.itemsCarrito.push({...juguete, cantidad: 1});
    }
    
    this.actualizarCarrito();
    this.carritoVisible = true;
  }

  eliminarItem(item: ItemCarrito) {
    this.itemsCarrito = this.itemsCarrito.filter(i => i._id !== item._id);
    this.actualizarCarrito();
  }

  incrementarCantidad(item: ItemCarrito) {
    item.cantidad++;
    this.actualizarCarrito();
  }

  decrementarCantidad(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCarrito();
    }
  }

  actualizarCarrito() {
    this.totalCarrito = this.itemsCarrito.reduce((total, item) => 
      total + (item.precio * item.cantidad), 0);
  }

  realizarPedido() {
    console.log('Realizando pedido:', this.itemsCarrito);
  }
}