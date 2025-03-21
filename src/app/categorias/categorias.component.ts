import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuguetesService, Juguete } from '../services/juguetes.service';
import { NavegacionService } from '../services/navegacion.service';
import { CarritoService } from '../services/carrito.service'
import { CarritoLateralComponent } from '../carrito-lateral/carrito-lateral.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

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
export class CategoriasComponent implements OnInit, OnDestroy {
  categorias = [
    { id: 'puzzles', nombre: 'Puzzles', imagen: 'puzzles.jpg' },
    { id: 'juegos-creatividad', nombre: 'Juegos de Creatividad', imagen: 'creatividad.jpg' },
    { id: 'juegos-mesa', nombre: 'Juegos de Mesa', imagen: 'mesa.jpg' },
    { id: 'juegos-madera', nombre: 'Juegos de Madera', imagen: 'madera.jpg' }
  ];

  juguetes: any[] = [];
  juguetesFiltrados: any[] = [];
  categoriaSeleccionada: string = '';
  categoriaActual: string = '';
  error: string = '';
  carritoVisible = false;
  itemsCarrito: ItemCarrito[] = [];
  totalCarrito = 0;
  cargando: boolean = false;
  private apiUrl = environment.apiUrl;
  private subscriptions: Subscription = new Subscription();

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
    this.cargarNovedades();
    
    // Suscribirse a los cambios del carrito
    this.subscriptions.add(
      this.carritoService.carrito$.subscribe(() => {
        if (this.categoriaSeleccionada) {
          this.actualizarStockCategoria();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  cambiarContenido(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.categoriaActual = categoria;
    this.error = '';
    this.cargando = true;
    
    const rutaCategoria = categoria === 'novedades' ? '' : categoria;
    
    this.juguetesService.getJuguetesPorCategoria(rutaCategoria)
      .subscribe({
        next: (juguetes) => {
          this.juguetes = juguetes;
          this.juguetesFiltrados = juguetes;
          this.cargando = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los juguetes. Por favor, intenta de nuevo.';
          this.juguetes = [];
          this.juguetesFiltrados = [];
          this.cargando = false;
        }
      });
  }

  getCategoriaTitle(categoria: string): string {
    const categoriaEncontrada = this.categorias.find(c => c.id === categoria);
    return categoriaEncontrada ? categoriaEncontrada.nombre : 'Novedades';
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
    try {
      await this.carritoService.agregarItem(juguete, 1);

      // Actualizar stock en juguetesFiltrados
      this.juguetes = this.juguetes.map(j => 
        j._id === juguete._id ? { ...j, stock: j.stock - 1 } : j
      );

      // Mostrar el carrito lateral
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
    this.categoriaSeleccionada = categoria;
    this.categoriaActual = categoria;
    this.actualizarStockCategoria();
  }

  private actualizarStockCategoria() {
    this.http.get<any[]>(`${this.apiUrl}/${this.categoriaSeleccionada}`).subscribe({
      next: (data) => {
        this.juguetes = data;
        this.juguetesFiltrados = data;
        this.error = '';
      },
      error: (error) => {
        console.error('Error al cargar juguetes:', error);
        this.error = 'Error al cargar los juguetes. Por favor, inténtelo de nuevo.';
        this.juguetes = [];
        this.juguetesFiltrados = [];
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
  }
}