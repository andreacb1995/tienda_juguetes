import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/* Interceptor para añadir las credenciales a todas las peticiones */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Añadir withCredentials a todas las peticiones
    const authReq = request.clone({
      withCredentials: true
    });
    return next.handle(authReq);
  }
} 