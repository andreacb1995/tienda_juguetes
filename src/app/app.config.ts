import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { JuguetesService } from './servicios/juguetes.service';
import { CarritoService } from './servicios/carrito.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    JuguetesService,
    CarritoService
  ]
};
