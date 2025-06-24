import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TipoTrabajador } from '../modelos/tipo-trabajador.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TiposTrabajadoresService {

  apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  obtenerTiposTrabajadores(): Observable<TipoTrabajador[]> {
    return this.http.get<ApiResponse<TipoTrabajador[]>>(`${this.apiUrl}/tipos-trabajadores`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  obtenerTipoTrabajador(id: number): Observable<TipoTrabajador> {
    return this.http.get<ApiResponse<TipoTrabajador>>(`${this.apiUrl}/tipos-trabajadores/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  agregarTipoTrabajador(tipoTrabajador: TipoTrabajador): Observable<TipoTrabajador> {
    return this.http.post<ApiResponse<TipoTrabajador>>(
      `${this.apiUrl}/tipos-trabajadores`,
      tipoTrabajador,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  editarTipoTrabajador(id: number, datos: TipoTrabajador): Observable<TipoTrabajador> {
    return this.http.put<ApiResponse<TipoTrabajador>>(
      `${this.apiUrl}/tipos-trabajadores/${id}`,
      datos,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  eliminarTipoTrabajador(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/tipos-trabajadores/${id}`, 
      { headers: this.getAuthHeaders() }).pipe(
      map(() => void 0)
    );
  }

  buscarTiposTrabajadores(nombre: string): Observable<TipoTrabajador[]> {
    return this.http.get<ApiResponse<TipoTrabajador[]>>(`${this.apiUrl}/tipos-trabajadores/search?nombre=${nombre}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }
}
