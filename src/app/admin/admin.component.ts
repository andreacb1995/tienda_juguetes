import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminProductosComponent } from '../admin-productos/admin-productos.component';
import { AdminPedidosComponent } from '../admin-pedidos/admin-pedidos.component';
import { NavegacionService } from '../services/navegacion.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AdminProductosComponent,
    AdminPedidosComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(    
    private navegacionService: NavegacionService,
  ) {
    
  }
  ngOnInit() {}

  volverAInicio() {
    this.navegacionService.irAPrincipal();
  }
}