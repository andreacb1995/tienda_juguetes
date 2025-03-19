import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../services/auth.service';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  providers: [AuthService, PedidosService],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any;
  pedidos: any[] = [];

  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    /*this.authService.getUserProfile().subscribe(
      user => this.usuario = user
    );*/

    this.pedidosService.getPedidosUsuario().subscribe(
      pedidos => this.pedidos = pedidos
    );
  }

  editarPerfil() {
    console.log('Editar perfil');
  }
}
