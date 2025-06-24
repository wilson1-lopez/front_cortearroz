import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  private apiUrl = 'http://localhost:8000/api/mantenimientos/completo';

  constructor(private http: HttpClient) {}

  crearMantenimiento(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
