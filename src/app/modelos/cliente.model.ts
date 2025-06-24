import { Usuario } from "./usuario.model";

export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  direccion: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
  usuario?: Usuario;
}
