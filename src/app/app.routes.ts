import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';

export const routes: Routes = [
    {path:"", redirectTo:"principal", pathMatch:"full"},
    {path:"principal", component:PrincipalComponent}

];