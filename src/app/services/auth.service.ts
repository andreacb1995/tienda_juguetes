import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActual = new BehaviorSubject<any>(null);
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

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true })
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
    return this.http.get(`${this.apiUrl}/auth/verificar-sesion`, { withCredentials: true })
      .pipe(
        tap((respuesta: any) => {
          console.log('Respuesta verificación:', respuesta);
          if (respuesta.autenticado && respuesta.usuario) {
            this.usuarioActual.next(respuesta.usuario);
          } else {
            this.usuarioActual.next(null);
          }
        }),
        catchError(error => {
          console.error('Error en verificación:', error);
          this.usuarioActual.next(null);
          return of({ autenticado: false });
        })
      );
  }

  cerrarSesion(): Observable<any> {
    return this.logout();
  }

  estaAutenticado(): boolean {
    return !!this.usuarioActual.value;
  }

  obtenerUsuarioActual(): Observable<any> {
    return this.usuario$.pipe(
      tap(usuario => console.log('Usuario actual en servicio:', usuario))
    );
  }
}
