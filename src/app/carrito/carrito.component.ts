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

  constructor(
    private carritoService: CarritoService,
    private navegacionService: NavegacionService,
    private fb: FormBuilder,
    private authService: AuthService,
    private pedidosService: PedidosService
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

  async confirmarPedido() {
    if (this.datosEnvioForm.valid) {
      try {
        const pedido: any = {
          datosCliente: this.datosEnvioForm.value,
          productos: this.items.map(item => ({
            productoId: item._id,
            categoria: item.categoria,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
          })),
          total: this.total
        };

        // Obtener el usuario actual usando firstValueFrom
        this.authService.obtenerUsuarioActual().subscribe({
          next: (usuario) => {
            if (usuario) {
              pedido.usuarioId = usuario.id;
            }
            
            // Crear el pedido
            this.pedidosService.crearPedido(pedido).subscribe({
              next: (resultado) => {
                if (resultado) {
                  // Limpiar el carrito
                  this.carritoService.eliminarTodoDelCarrito();
                  this.navegacionService.irAPrincipal();
                }
              },
              error: (error) => {
                console.error('Error al crear pedido:', error);
                alert('Error al procesar el pedido. Por favor, inténtelo de nuevo.');
              }
            });
          },
          error: (error) => {
            console.error('Error al obtener usuario:', error);
            // Continuar con el pedido sin usuario
            this.pedidosService.crearPedido(pedido).subscribe({
              next: (resultado) => {
                if (resultado) {
                  this.carritoService.eliminarTodoDelCarrito();
                  alert('Pedido realizado con éxito');
                  this.navegacionService.irAPrincipal();
                }
              },
              error: (error) => {
                console.error('Error al crear pedido:', error);
                alert('Error al procesar el pedido. Por favor, inténtelo de nuevo.');
              }
            });
          }
        });

      } catch (error) {
        console.error('Error general:', error);
        alert('Error al procesar el pedido. Por favor, inténtelo de nuevo.');
      }
    } else {
      alert('Por favor, complete todos los campos requeridos');
      Object.keys(this.datosEnvioForm.controls).forEach(key => {
        const control = this.datosEnvioForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
