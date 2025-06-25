import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Temporada } from '../modelos/temporada.model';

@Injectable({
  providedIn: 'root'
})
export class TemporadasService {
  private apiUrl = 'http://127.0.0.1:8000/api/temporadas';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Obtener todas las temporadas
  obtenerTemporadas(): Observable<Temporada[]> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener una temporada por ID
  obtenerTemporadaPorId(id: number): Observable<Temporada> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Crear una nueva temporada
  crearTemporada(temporada: Temporada): Observable<Temporada> {
    return this.http.post<any>(this.apiUrl, temporada, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Actualizar una temporada
  actualizarTemporada(id: number, temporada: Temporada): Observable<Temporada> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, temporada, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Eliminar una temporada
  eliminarTemporada(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Buscar temporadas por nombre
  buscarTemporadas(nombre: string): Observable<Temporada[]> {
    return this.http.post<any>(`${this.apiUrl}/buscar`, { nombre }, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener temporadas del usuario autenticado
  obtenerTemporadasUsuario(): Observable<Temporada[]> {
    return this.http.get<any>(`${this.apiUrl}/usuario`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener temporadas en rango de fechas
  obtenerTemporadasEnRango(fechaInicio: string, fechaFin: string): Observable<Temporada[]> {
    return this.http.post<any>(`${this.apiUrl}/rango`, 
      { fecha_inicio: fechaInicio, fecha_fin: fechaFin }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }
}
