import { TipoTrabajador } from "./tipo-trabajador.model";
import { Usuario } from "./usuario.model";

export interface Trabajador {
  id?: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  cedula?: string;
  direccion?: string;
  tipo_id: number;
  usuario_id?: number; // Opcional porque se asigna automáticamente en el backend
  created_at?: string;
  updated_at?: string;
  tipo?: TipoTrabajador;
  usuario?: Usuario;
}