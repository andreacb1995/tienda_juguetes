import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { CategoriasComponent } from './categorias/categorias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CabeceraComponent, CategoriasComponent],
  template: `
    <app-cabecera></app-cabecera>
    <app-categorias></app-categorias>
  `
})
export class AppComponent {}
