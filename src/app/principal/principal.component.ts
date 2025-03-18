import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { CategoriasComponent } from '../categorias/categorias.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CabeceraComponent, CategoriasComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})

export class PrincipalComponent {
  constructor(private router: Router) {}

}
