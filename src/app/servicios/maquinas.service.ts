import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Maquina } from '../modelos/maquina.model';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class MaquinasService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient,  private loginService: LoginService) { }

  obtenerMaquinas(): Observable<Maquina[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Maquina[]>(`${this.apiUrl}/maquinasusuario`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
  
  agregarMaquina(maquina: Maquina): Observable<Maquina> {
    return this.http.post<Maquina>(
      `${this.apiUrl}/maquinas`,
      maquina,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarMaquina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/maquinas/${id}`, { headers: this.getAuthHeaders() });
  }
 
  editarMaquina(maquina: Maquina): Observable<Maquina> {
    return this.http.put<Maquina>(
      `${this.apiUrl}/maquinas/${maquina.id}`,
      maquina,
      { headers: this.getAuthHeaders() }
    );
  }
}
