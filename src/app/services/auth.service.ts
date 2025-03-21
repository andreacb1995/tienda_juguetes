import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: string;
  username: string;
  rol: 'admin' | 'usuario';
}

@Injectable({
  providedIn: 'root'
})

/* Servicio de autenticación */
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.verificarSesion();
  }

  /* Método para registrar un usuario */
  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, usuario)
      .pipe(
        tap((respuesta: any) => {
          if (respuesta.usuario) {
            this.usuarioSubject.next(respuesta.usuario);
          }
        })
      );
  }

  /* Método para iniciar sesión */    
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.usuario) {
            this.usuarioSubject.next(response.usuario);
            this.isLoggedInSubject.next(true);
            
            // Redirigir según el rol
            if (response.usuario.rol === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        })
      );
  }

  /* Método para cerrar sesión */
  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.usuarioSubject.next(null);
          this.isLoggedInSubject.next(false);
          this.router.navigate(['/']);
        })
      );
  }

  /* Método para verificar la sesión */
  verificarSesion() {
    this.http.get<any>(`${this.apiUrl}/auth/verificar`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.usuario) {
            this.usuarioSubject.next(response.usuario);
            this.isLoggedInSubject.next(true);
          }
        },
        error: () => {
          this.usuarioSubject.next(null);
          this.isLoggedInSubject.next(false);
        }
      });
  }

  /* Método para verificar si el usuario es administrador */
  esAdmin(): boolean {
    const usuario = this.usuarioSubject.value;
    return usuario?.rol === 'admin';
  }

  /* Método para obtener el usuario actual */ 
  obtenerUsuarioActual(): Observable<Usuario | null> {
    return this.usuario$;
  }
}
