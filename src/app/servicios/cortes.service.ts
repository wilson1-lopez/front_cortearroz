import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Corte, CorteFormData } from '../modelos/corte.model';

@Injectable({
  providedIn: 'root'
})
export class CortesService {
  private apiUrl = 'http://127.0.0.1:8000/api/cortes';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Obtener todos los cortes
  obtenerCortes(): Observable<Corte[]> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener un corte por ID
  obtenerCortePorId(id: number): Observable<Corte> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Crear un nuevo corte
  crearCorte(corte: CorteFormData): Observable<Corte> {
    return this.http.post<any>(this.apiUrl, corte, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Actualizar un corte
  actualizarCorte(id: number, corte: CorteFormData): Observable<Corte> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, corte, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Eliminar un corte
  eliminarCorte(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener cortes por cliente
  obtenerCortesPorCliente(clienteId: number): Observable<Corte[]> {
    return this.http.get<any>(`${this.apiUrl}/cliente/${clienteId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener cortes por temporada
  obtenerCortesPorTemporada(temporadaId: number): Observable<Corte[]> {
    return this.http.get<any>(`${this.apiUrl}/temporada/${temporadaId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener cortes activos
  obtenerCortesActivos(): Observable<Corte[]> {
    return this.http.get<any>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener cortes en rango de fechas
  obtenerCortesEnRango(fechaInicio: string, fechaFin: string): Observable<Corte[]> {
    return this.http.post<any>(`${this.apiUrl}/rango`, 
      { fecha_inicio: fechaInicio, fecha_fin: fechaFin }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  // Buscar cortes por descripción
  buscarCortes(descripcion: string): Observable<Corte[]> {
    return this.http.post<any>(`${this.apiUrl}/buscar`, { descripcion }, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Obtener cortes por cliente y temporada
  obtenerCortesPorClienteYTemporada(clienteId: number, temporadaId: number): Observable<Corte[]> {
    return this.http.get<any>(`${this.apiUrl}/cliente/${clienteId}/temporada/${temporadaId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }
}
