import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { MaquinasComponent } from './paginas/maquinas/maquinas.component';
import { MantenimientosComponent } from './paginas/mantenimientos/mantenimientos.component';
import { ProveedoresComponent } from './paginas/proveedores/proveedores.component';
import { RepuestosComponent } from './paginas/repuestos/repuestos.component';
import { DetallemantenimientoComponent } from './paginas/detallemantenimiento/detallemantenimiento.component';
import { ClientesComponent } from './paginas/clientes/clientes.component';
import { TiposTrabajadoresComponent } from './paginas/tipos-trabajadores/tipos-trabajadores.component';
import { TrabajadoresComponent } from './paginas/trabajadores/trabajadores.component';
import { TemporadasComponent } from './paginas/temporadas/temporadas.component';
import { DetallesTemporadaComponent } from './paginas/detalles-temporada/detalles-temporada.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'maquinas', 
    component: MaquinasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mantenimientos/:id', 
    component: MantenimientosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'proveedores', 
    component: ProveedoresComponent,
    canActivate: [authGuard]
  },
  {
    path: 'repuestos', 
    component: RepuestosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'detallemantenimientos/:id', 
    component: DetallemantenimientoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'clientes', 
    component: ClientesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tipos-trabajadores', 
    component: TiposTrabajadoresComponent,
    canActivate: [authGuard]
  },
  {
    path: 'trabajadores', 
    component: TrabajadoresComponent,
    canActivate: [authGuard]
  },
  {
    path: 'temporadas', 
    component: TemporadasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'temporadas/detalles/:id', 
    component: DetallesTemporadaComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
