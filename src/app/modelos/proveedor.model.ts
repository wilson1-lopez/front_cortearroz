import { Pivot } from "./repuesto.models";
import { Usuario } from "./usuario.model";

export interface Proveedor {  
id: number;  
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  precio: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  usuario: Usuario;
  pivot: Pivot;

}