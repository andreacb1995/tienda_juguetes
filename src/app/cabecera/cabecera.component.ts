import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  irAPrincipal() {
    this.router.navigate(['/']);
  }

  abrirLogin() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      panelClass: 'login-dialog'
    });
  }

  irACarrito() {
    this.router.navigate(['/carrito']);
  }
}
