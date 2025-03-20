import { Routes } from '@angular/router';
import { CarritoComponent } from './carrito/carrito.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { PerfilComponent } from './perfil/perfil.component';
export const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent
  },
  {
    path: 'carrito',
    component: CarritoComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];