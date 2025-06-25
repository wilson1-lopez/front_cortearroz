import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trabajador } from '../modelos/trabajador.model';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private apiUrl = 'http://127.0.0.1:8000/api/trabajadores';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Obtener todos los trabajadores
  obtenerTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<any>(`${this.apiUrl}/trabajadoresusuario`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener un trabajador por ID
  obtenerTrabajadorPorId(id: number): Observable<Trabajador> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Crear un nuevo trabajador
  crearTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<any>(this.apiUrl, trabajador, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Actualizar un trabajador
  actualizarTrabajador(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, trabajador, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Eliminar un trabajador
  eliminarTrabajador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Buscar trabajadores por nombre
  buscarTrabajadores(nombre: string): Observable<Trabajador[]> {
    return this.http.post<any>(`${this.apiUrl}/buscar`, { nombre }, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener trabajadores por usuario
  obtenerTrabajadoresPorUsuario(usuarioId: number): Observable<Trabajador[]> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener trabajadores por tipo
  obtenerTrabajadoresPorTipo(tipoId: number): Observable<Trabajador[]> {
    return this.http.get<any>(`${this.apiUrl}/tipo/${tipoId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener trabajador por cédula
  obtenerTrabajadorPorCedula(cedula: string): Observable<Trabajador> {
    return this.http.get<any>(`${this.apiUrl}/cedula/${cedula}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }
}