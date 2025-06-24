import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { MaquinasComponent } from './paginas/maquinas/maquinas.component';
import { MantenimientosComponent } from './paginas/mantenimientos/mantenimientos.component';
import { ProveedoresComponent } from './paginas/proveedores/proveedores.component';
import { RepuestosComponent } from './paginas/repuestos/repuestos.component';
import { DetallemantenimientoComponent } from './paginas/detallemantenimiento/detallemantenimiento.component';
import { ClientesComponent } from './paginas/clientes/clientes.component';

export const routes: Routes = [
{
    path: '',
    component: LoginComponent,
},
{
    path: 'dashboard',
    component: DashboardComponent
  },
  { path: 'maquinas', component: MaquinasComponent },

  {
    path: 'mantenimientos/:id', component: MantenimientosComponent
  },

  {
    path: 'proveedores', component: ProveedoresComponent
  },

  {
    path: 'repuestos', component: RepuestosComponent
  },

  {
    path: 'detallemantenimientos/:id', component: DetallemantenimientoComponent
  },

   {
    path: 'clientes', component: ClientesComponent
  },

];
