import { Usuario } from "./usuario.model";

export interface Maquina {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    usuario_id: number;
    created_at: string;
    updated_at: string;
    usuario: Usuario;
  }