import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Repuesto } from '../modelos/repuesto.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepuestosService {

  apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  obtenerRepuestos(): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${this.apiUrl}/repuestosusuario`, {
      headers: this.getAuthHeaders()
    });
  }

  agregarRepuesto(repuesto: Repuesto): Observable<Repuesto> {
    return this.http.post<Repuesto>(
      `${this.apiUrl}/repuestos`,
      repuesto,
      { headers: this.getAuthHeaders() }
    );
  }

  filtrarRepuestosPorNombre(nombre: string): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${this.apiUrl}/repuestosusuario`, {
      headers: this.getAuthHeaders(),
      params: { nombre }
    });
  }

  eliminarRepuesto(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/repuestos/${id}`, {
    headers: this.getAuthHeaders()
  });
}

}
