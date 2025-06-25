import { Usuario } from "./usuario.model";

export interface Temporada {
  id?: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  valor_bulto: number;
  usuario_id?: number; // Opcional porque se asigna automáticamente en el backend
  created_at?: string;
  updated_at?: string;
  usuario?: Usuario;
}
