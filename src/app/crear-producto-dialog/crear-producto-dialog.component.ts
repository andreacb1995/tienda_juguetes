import { Component, OnInit } from '@angular/core';
import { JuguetesService } from '../services/juguetes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavegacionService } from '../services/navegacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-producto-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './crear-producto-dialog.component.html',
  styleUrl: './crear-producto-dialog.component.css'
})
export class CrearProductoDialogComponent implements OnInit {
  isAdmin = false;
  nuevoJuguete: any = {
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

  constructor(
    private juguetesService: JuguetesService,
    private snackBar: MatSnackBar,
    private navegacionService: NavegacionService,
    private authService: AuthService

  ) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.isAdmin = usuario?.rol === 'admin';
    });
  }

  /* Método para seleccionar una imagen */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.nuevoJuguete.datos.imagen = event.target.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevoJuguete.datos.imagenPreview = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }
  /* Método para agregar un juguete */  
  agregarJuguete() {
    // Validar campos obligatorios
    if (!this.nuevoJuguete.datos.nombre || !this.nuevoJuguete.datos.precio || !this.nuevoJuguete.datos.descripcion ||
      !this.nuevoJuguete.datos.edad_recomendada || !this.nuevoJuguete.datos.dimensiones || 
      !this.nuevoJuguete.datos.marca || !this.nuevoJuguete.datos.stock || !this.nuevoJuguete.categoria) {
      this.mostrarMensajeError('Por favor, complete todos los campos obligatorios.');
      return;
    }
   console.log(this.nuevoJuguete.datos.imagen)
    this.juguetesService.agregarJuguete(this.nuevoJuguete).subscribe({
      next: () => {
        this.mostrarMensajeExito('Juguete agregado exitosamente');
        this.navegacionService.irAAdmin();
      },
      error: () => {
        this.mostrarMensajeError('Error al agregar el juguete');
      }
    });
  }

  /* Método para mostrar un mensaje de éxito */
  mostrarMensajeExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snackbar-exito'] });
  }

  /* Método para mostrar un mensaje de error */
  mostrarMensajeError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
  }

  /* Método para cancelar */
  cancelar() {
    this.navegacionService.irACarrito();
  }

  /* Método para ir a la página de administración */  
  irAAdmin() {
    if (this.isAdmin) {
      this.navegacionService.irAAdmin();
    }
  }
}
