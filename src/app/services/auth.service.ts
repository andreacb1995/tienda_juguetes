import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Usuario {
  id: string;
  username: string;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioActual.asObservable();
  isLoggedIn$ = this.usuario$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    this.verificarSesion().subscribe();
  }

  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, usuario)
      .pipe(
        tap((respuesta: any) => {
          if (respuesta.usuario) {
            this.usuarioActual.next(respuesta.usuario);
          }
        })
      );
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((respuesta: any) => {
          if (respuesta.usuario) {
            this.usuarioActual.next(respuesta.usuario);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.usuarioActual.next(null);
        })
      );
  }

  verificarSesion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verificar-sesion`)
      .pipe(
        tap((respuesta: any) => {
          if (respuesta.autenticado && respuesta.usuario) {
            this.usuarioActual.next(respuesta.usuario);
          } else {
            this.usuarioActual.next(null);
          }
        })
      );
  }

  cerrarSesion(): Observable<any> {
    return this.logout();
  }

  estaAutenticado(): boolean {
    return this.usuarioActual.value !== null;
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }
}
