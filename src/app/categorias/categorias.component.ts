import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuguetesService, Juguete } from '../services/juguetes.service';
import { NavegacionService } from '../services/navegacion.service';
import { CarritoService } from '../services/carrito.service'
import { CarritoLateralComponent } from '../carrito-lateral/carrito-lateral.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ItemCarrito extends Juguete {
  cantidad: number;
}

interface Categoria {
  id: string;
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, CarritoLateralComponent],
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
  cargando: boolean = false;
  categorias: Categoria[] = [
    {
      id: 'puzzles',
      nombre: 'Puzzles',
      imagen: 'puzzles.jpg'
    },
    {
      id: 'juegos-creatividad',
      nombre: 'Creatividad',
      imagen: 'creatividad.jpg'
    },
    {
      id: 'juegos-mesa',
      nombre: 'Mesa',
      imagen: 'mesa.jpg'
    },
    {
      id: 'juegos-madera',
      nombre: 'Madera',
      imagen: 'madera.jpg'
    }
  ];
  private apiUrl = environment.apiUrl;

  constructor(
    private juguetesService: JuguetesService,
    private navegacionService: NavegacionService,
    private carritoService: CarritoService,
    private router: Router,
    private http: HttpClient
  ) {
    this.navegacionService.cambioCategoria$.subscribe(categoria => {
      this.cambiarContenido(categoria);
    });
  }

  ngOnInit() {
    //this.carritoService.vaciarCarrito(); 
    this.cambiarContenido('novedades');
    this.carritoService.carrito$.subscribe(items => {
      this.itemsCarrito = [...items]; 
      this.actualizarCarrito();
    });
  }

  cambiarContenido(categoria: string): void {
    this.categoriaActual = categoria;
    this.error = '';
    this.cargando = true;
    
    const rutaCategoria = categoria === 'novedades' ? '' : categoria;
    
    this.juguetesService.getJuguetesPorCategoria(rutaCategoria)
      .subscribe({
        next: (juguetes) => {
          this.juguetesFiltrados = juguetes;
          this.cargando = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los juguetes. Por favor, intenta de nuevo.';
          this.juguetesFiltrados = [];
          this.cargando = false;
        }
      });
  }

  getCategoriaTitle(categoria: string): string {
    const titles: { [key: string]: string } = {
      'juegos-mesa': 'Juegos de Mesa',
      'puzzles': 'Puzzles',
      'juegos-creatividad': 'Creatividad',
      'juegos-madera': 'Juguetes de Madera',
      'novedades': 'Novedades'
    };
    return titles[categoria] || categoria;
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  getCantidadEnCarrito(juguete: Juguete): number {
    const itemCarrito = this.itemsCarrito.find(item => item._id === juguete._id);
    return itemCarrito ? itemCarrito.cantidad : 0;
  }

  getStockDisponible(juguete: Juguete): number {
    return this.carritoService.obtenerStockDisponible(juguete);
  }

  estaDisponible(juguete: any): boolean {
    return juguete.stock > 0;
  }

  async agregarAlCarrito(juguete: Juguete) {
    const stockDisponible = this.getStockDisponible(juguete);
    
    if (stockDisponible <= 0) {
      alert('No hay stock disponible');
      return;
    }

    try {
      await this.carritoService.agregarItem(juguete, 1);
      this.carritoService.mostrarCarritoLateral();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }

  actualizarCarrito() {
    this.totalCarrito = this.itemsCarrito.reduce((total, item) => 
      total + (item.precio * item.cantidad), 0);
  }

  seleccionarCategoria(categoriaId: string): void {
    this.navegacionService.cambiarCategoria(categoriaId);
  }
  
  irACarrito() {
    this.navegacionService.irACarrito();
  }

  cargarCategoria(categoria: string) {
    this.categoriaActual = categoria;
    this.error = '';
    this.cargando = true;
    
    this.http.get<any[]>(`${this.apiUrl}/${categoria}`).subscribe({
      next: (data) => {
        this.juguetesFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar juguetes:', error);
        this.error = 'Error al cargar los juguetes. Por favor, inténtelo de nuevo.';
        this.juguetesFiltrados = [];
        this.cargando = false;
      }
    });
  }

  cargarNovedades() {
    this.cargarCategoria('novedades');
  }

  agregarAlCarritoCategoria(juguete: any) {
    if (juguete.stock <= 0) {
      alert('No hay stock disponible para este producto');
      return;
    }
    
    this.carritoService.agregarItem(juguete);
    this.cargarCategoria(this.categoriaActual);
  }
}