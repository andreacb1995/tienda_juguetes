import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { JuguetesService } from '../services/juguetes.service';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {
  categorias = [
    { id: 'novedades', nombre: 'Novedades' },
    { id: 'puzzles', nombre: 'Puzzles' },
    { id: 'juegos-creatividad', nombre: 'Juegos de Creatividad' },
    { id: 'juegos-mesa', nombre: 'Juegos de Mesa' },
    { id: 'juegos-madera', nombre: 'Juegos de Madera' }
  ];
  
  categoriaSeleccionada = 'novedades';
  productos: any[] = [];
  cargando = false;
  error = '';

  constructor(
    private juguetesService: JuguetesService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.juguetesService.getJuguetesPorCategoria(this.categoriaSeleccionada)
      .subscribe({
        next: (productos) => {
          // Actualizar el stock teniendo en cuenta los carritos
          this.productos = productos.map(producto => ({
            ...producto,
            stockReal: this.carritoService.obtenerStockDisponible(producto)
          }));
          this.cargando = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los productos';
          this.cargando = false;
        }
      });
  }

  actualizarStock(producto: any) {
    this.juguetesService.actualizarStock(
      this.categoriaSeleccionada,
      producto._id,
      producto.stock
    ).subscribe({
      next: () => {
        alert('Stock actualizado correctamente');
        this.cargarProductos(); // Recargar para obtener el stock actualizado
      },
      error: (error) => {
        alert('Error al actualizar el stock');
      }
    });
  }

  onCategoriaChange() {
    this.cargarProductos();
  }
} 