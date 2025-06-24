import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Login } from '../paginas/login/modelos/login.model';
import { LoginResponse } from '../paginas/login/modelos/login-response.model';
import { AuthTokenPayload } from '../modelos/auth-token.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  constructor(private router: Router) {}

  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
      })
    );
  }

  
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<AuthTokenPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        this.logout(); // Limpiar token expirado
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Token inválido', e);
      this.logout(); // Limpiar token inválido
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioAutenticado(): AuthTokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      return jwtDecode<AuthTokenPayload>(token);
    } catch (e) {
      console.error('Token inválido', e);
      return null;
    }
  }
}
