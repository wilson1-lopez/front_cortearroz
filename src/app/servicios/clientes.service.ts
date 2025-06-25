import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../modelos/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<any>(`${this.apiUrl}/clientesusuario`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data || response)
    );
  }

  agregarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      `${this.apiUrl}/clientes`,
      cliente,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`, 
      { headers: this.getAuthHeaders() });
  }

  editarCliente(id: number, datos: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/clientes/${id}`,
      datos,
      { headers: this.getAuthHeaders() }
    );
  }
}
