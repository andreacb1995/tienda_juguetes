import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { JuguetesService } from '../services/juguetes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrearProductoDialogComponent } from '../crear-producto-dialog/crear-producto-dialog.component';
import { Router } from '@angular/router';
import { NavegacionService } from '../services/navegacion.service';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
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
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private navegacionService: NavegacionService
    ) {}  

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.juguetesService.getJuguetesPorCategoria(this.categoriaSeleccionada)
      .subscribe({
        next: (productos) => {
          this.productos = productos.map(producto => ({
            ...producto,
            stockReal: producto.stock
          }));
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar los productos';
          this.cargando = false;
        }
      });
  }

  actualizarStock(producto: any) {
    this.juguetesService.actualizarStock(this.categoriaSeleccionada, producto._id, producto.stock)
      .subscribe({
        next: () => {
          this.mostrarMensajeExito('Stock actualizado correctamente');
          this.cargarProductos();
        },
        error: () => {
          this.mostrarMensajeError('Error al actualizar el stock');
        }
      });
  }

  onCategoriaChange() {
    this.cargarProductos();
  }

  abrirAgregarJuguete() {
    this.navegacionService.IraCrearJuguete();
  }

  mostrarMensajeExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snackbar-exito'] });
  }

  mostrarMensajeError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
  }
}



