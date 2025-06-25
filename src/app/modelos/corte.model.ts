import { Cliente } from './cliente.model';
import { Temporada } from './temporada.model';
import { Maquina } from './maquina.model';
import { Trabajador } from './trabajador.model';

export interface Corte {
  id?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  valor_bulto: number;
  descripcion?: string;
  cliente_id: number;
  temporada_id: number;
  created_at?: string;
  updated_at?: string;
  cliente?: Cliente;
  temporada?: Temporada;
  maquinas?: Maquina[];
  trabajadores?: TrabajadorCorte[];
}

export interface TrabajadorCorte extends Trabajador {
  precio_acordado: number;
}

export interface CorteFormData {
  fecha_inicio: string;
  fecha_fin?: string;
  valor_bulto: number;
  descripcion?: string;
  cliente_id: number;
  temporada_id: number;
  maquinas?: number[];
  trabajadores?: {
    trabajador_id: number;
    precio_acordado: number;
  }[];
}
