import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { RegistroComponent } from '../registro/registro.component';
import { MatButtonModule } from '@angular/material/button';
import { NavegacionService } from '../services/navegacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private navegacionService: NavegacionService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.error = error.error?.mensaje || 'Error al iniciar sesión';
        }
      });
  }

  abrirRegistro() {
    this.dialogRef.close();
    this.navegacionService.irARegistro();
  }
}
