import { Proveedor } from "./proveedor.model";
import { Usuario } from "./usuario.model";

export interface Repuesto {
id: number;  
  nombre: string;
  descripcion: string;
  usuario_id: number;
  proveedores: Proveedor[]; // Relación con proveedores
  created_at: string;
  updated_at: string;
  usuario: Usuario;

}

export interface Pivot {
  precio: number;
}