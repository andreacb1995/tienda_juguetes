import { Routes } from '@angular/router';
import { CarritoComponent } from './carrito/carrito.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminGuard } from './guards/admin.guard';

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
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];