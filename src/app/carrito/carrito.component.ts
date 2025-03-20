import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { Subscription } from 'rxjs';
import { NavegacionService } from '../services/navegacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PedidosService } from '../services/pedidos.service';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
  items: any[] = [];
  total: number = 0;    
  private subscription: Subscription = new Subscription();
  datosEnvioForm: FormGroup = new FormGroup({});    
  mostrarFormulario = false;
  usuarioActual: any = null;
  procesandoPedido = false;

  constructor(
    private carritoService: CarritoService,
    private navegacionService: NavegacionService,
    private fb: FormBuilder,
    private authService: AuthService,
    private pedidosService: PedidosService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.subscription.add(
      this.carritoService.obtenerItems().subscribe(items => {
        this.items = items;
        this.actualizarTotal();
      })
    );
    this.authService.obtenerUsuarioActual().subscribe(
      usuario => {
        if (usuario) {
          this.usuarioActual = usuario;
          this.cargarDatosUsuario(usuario);
        }
      },
      error => console.error('Error al obtener usuario:', error)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  async decrementarCantidad(item: any) {
    if (item.cantidad > 1) {
      try {
        // Decrementar la cantidad del producto en el carrito
        await this.carritoService.eliminarItem(item,1);
      } catch (error) {
        console.error('Error al decrementar cantidad:', error);
      }
    }
  }
  
  async incrementarCantidad(item: any) {
    const cantidadEnCarrito = item.cantidad || 0;  
    const stockDisponible = item.stock;

    // Verificar si la cantidad en el carrito ya alcanzó el stock disponible
    if (cantidadEnCarrito >= stockDisponible) {
      console.log('No puedes agregar más de lo que hay en stock.');
      return; // Si ya se alcanzó el stock, no se incrementa la cantidad
    }
    try {
      // Incrementar la cantidad del producto en el carrito
      await this.carritoService.agregarItem(item, 1);
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
    }
  }
  
  async eliminarProducto(item: any) {
    try {
      await this.carritoService.eliminarItem(item, item.cantidad);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  actualizarTotal() {
    this.total = this.carritoService.obtenerTotal();
  }


  volverATienda() {
    this.navegacionService.irAPrincipal();
  }
  
  iraLogin(){
    this.navegacionService.abrirLogin();
  }

  crearFormulario() {
    this.datosEnvioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      piso: [''],
      codigoPostal: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required]
    });
  }

  cargarDatosUsuario(usuario: any) {
    console.log('Cargando datos de usuario:', usuario);
    if (usuario) {
      this.datosEnvioForm.patchValue({
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        calle: usuario.direccion?.calle || '',
        numero: usuario.direccion?.numero || '',
        piso: usuario.direccion?.piso || '',
        codigoPostal: usuario.direccion?.codigoPostal || '',
        ciudad: usuario.direccion?.ciudad || '',
        provincia: usuario.direccion?.provincia || ''
      });
    }
  }

  iniciarPedido() {
    this.mostrarFormulario = true;
  }

  confirmarPedido() {
    if (this.datosEnvioForm.valid && !this.procesandoPedido) {
      this.procesandoPedido = true; // Evita múltiples envíos

      const datosCliente = {
        nombre: this.datosEnvioForm.get('nombre')?.value,
        apellidos: this.datosEnvioForm.get('apellidos')?.value,
        email: this.datosEnvioForm.get('email')?.value,
        telefono: this.datosEnvioForm.get('telefono')?.value,
        direccion: this.datosEnvioForm.get('direccion')?.value
      };

      const productos = this.items.map(item => ({
        _id: item._id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        categoria: item.categoria
      }));

      this.authService.usuario$.pipe(take(1)).subscribe(usuario => {
        const pedidoData = {
          usuarioId: usuario?.id,
          datosCliente: datosCliente,
          productos: productos,
          total: this.total
        };

        this.pedidosService.crearPedido(pedidoData).subscribe({
          next: (respuesta) => {
            this.router.navigate(['/confirmacion-pedido', respuesta.pedido.id]);
            this.procesandoPedido = false;
          },
          error: (error) => {
            console.error('Error al crear pedido:', error);
            alert('Error al procesar el pedido. Por favor, inténtelo de nuevo.');
            this.procesandoPedido = false;
          }
        });
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }
}
