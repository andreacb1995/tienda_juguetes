import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavegacionService } from '../services/navegacion.service';

interface Usuario {
  username: string;
  password: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    codigoPostal: string;
    ciudad: string;
    provincia: string;
  };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario: Usuario = {
    username: '',
    password: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      numero: '',
      codigoPostal: '',
      ciudad: '',
      provincia: ''
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private navegacionService: NavegacionService
  ) {}

  onSubmit() {
    console.log('Enviando datos de registro:', this.usuario);
    this.authService.registro(this.usuario).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
      }
    });
  }

  volverAInicio() {
    this.navegacionService.irAPrincipal();
  }
}
