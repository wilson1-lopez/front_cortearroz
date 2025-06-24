import { Maquina } from "./maquina.model";

export interface Usuario {
    id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  email: string;
  google_id: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  }
  