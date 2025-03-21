import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { JuguetesService } from '../services/juguetes.service';
import { CarritoService } from '../services/carrito.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  mostrarFormulario = false;

    // Objeto para almacenar los datos del nuevo juguete
  nuevoJuguete: any = {
    categoria: 'novedades', // Categoría seleccionada
    datos: { // Datos del juguete
        nombre: '',
        precio: 0,
        imagen: '',
        categoria: 'novedades',
        descripcion: '',
        edad_recomendada: '',
        dimensiones: '',
        marca: '',
        stock: 0
    }
  };

  constructor(
    private juguetesService: JuguetesService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
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
        this.mostrarMensajeExito('Stock actualizado correctamente');
        this.cargarProductos(); // Recargar para obtener el stock actualizado
      },
      error: (error) => {
        this.mostrarMensajeError('Error al actualizar el stock');
      }
    });
  }

  onCategoriaChange() {
    this.cargarProductos();
  }

  // Método para agregar un nuevo juguete
  agregarJuguete() {
    this.cargando = true;
    this.juguetesService.agregarJuguete(this.nuevoJuguete)
        .subscribe({
          next: (juguete) => {
              this.mostrarMensajeExito('Juguete agregado exitosamente');
              this.cargarProductos(); // Recargar la lista de productos
              this.cargando = false;
              this.nuevoJuguete = { // Reiniciar el formulario
                  categoria: 'novedades',
                  datos: {
                      nombre: '',
                      precio: 0,
                      imagen: '',
                      categoria: 'novedades',
                      descripcion: '',
                      edad_recomendada: '',
                      dimensiones: '',
                      marca: '',
                      stock: 0
                  }
              };
          },
          error: (error) => {
            this.error = 'Error al agregar el juguete';
            this.cargando = false;
        }
    });
  }

      // Método para mostrar mensajes de éxito
  mostrarMensajeExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, 
      panelClass: ['snackbar-exito'], 
    });
  }

  // Método para mostrar mensajes de error
  mostrarMensajeError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, 
      panelClass: ['snackbar-error'], 
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
} 