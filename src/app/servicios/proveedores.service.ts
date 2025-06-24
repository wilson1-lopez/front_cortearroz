import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../modelos/proveedor.model';


@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient ) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
  

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedoresusuario`, {
      headers: this.getAuthHeaders()
    });

  }

  agregarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(
      `${this.apiUrl}/proveedores`,
      proveedor,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proveedores/${id}`, 
      { headers: this.getAuthHeaders() });
  }

  
editarProveedor(id: number, datos: any) {
  return this.http.put<Proveedor>(
    `${this.apiUrl}/proveedores/${id}`,
    datos,
    { headers: this.getAuthHeaders() }
  );
}


obtenerRepuestosProveedores(): Observable<any[]> {
    // Cambia la URL al endpoint correcto según tu backend
    return this.http.get<any[]>(`${this.apiUrl}/repuestosusuario`, {
      headers: this.getAuthHeaders()
    });
  }
 
}
