import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleMantenimientoService {
  private baseUrl = 'http://localhost:8000/api/maquinas';

  constructor(private http: HttpClient) {}

  getDetalleMantenimiento(maquinaId: number): Observable<any> {
    const url = `${this.baseUrl}/${maquinaId}/mantenimientos-detalle`;
    return this.http.get<any>(url);
  }
}
