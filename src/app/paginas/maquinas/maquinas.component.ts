import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaquinasService } from '../../servicios/maquinas.service';
import { Maquina } from '../../modelos/maquina.model';
import Swal from 'sweetalert2';
import {  ModalAgregarMaquinaComponent } from './modalAgregarMaquina/modalAgregarMaquina.component';
import { ModaleditarMaquinaComponent } from './modalEditarMaquina/modalEditarMaquina.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-maquinas',
  standalone: true,
  imports: [CommonModule,
     ReactiveFormsModule, 
     ModalAgregarMaquinaComponent, 
     ModaleditarMaquinaComponent,
     FormsModule
    ],
  templateUrl: './maquinas.component.html',
  styleUrl: './maquinas.component.css'
})
export class MaquinasComponent implements OnInit {
  // Referencia al componente ModaleditarComponent para poder
  // abrir el modal desde este componente
  @ViewChild('modalEditar') modalEditar!: ModaleditarMaquinaComponent;
  // Array de máquinas
  maquinas: Maquina[] = [];
  // Formulario para agregar una máquina

  // Máquina seleccionada para editar
  maquinaSeleccionada!: Maquina;
  maquinasFiltradas: Maquina[] = []; // Para almacenar las máquinas filtradas
  buscarTermino: string = ''; // Para el término de búsqueda
  errorAlCargar: boolean = false;
  cargando: boolean = true;


  

  constructor(
    // Servicio para interactuar con la API de máquinas
    private maquinasService: MaquinasService,
    // Servicio para crear formularios
    private fb: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar las máquinas al iniciar el componente
    this.cargarMaquinas();
  }

  // Método para cargar las máquinas desde la API
  cargarMaquinas() {
    
  this.maquinasService.obtenerMaquinas().subscribe(
    (data) => {
      this.maquinas = data || [];
      this.maquinasFiltradas = data || [];
      this.errorAlCargar = false;
      this.cargando = false; // Desactivar la carga cuando los datos se reciben
    },
    (error) => {
      this.errorAlCargar = true;
      this.maquinas = [];
      this.cargando = false; // Desactivar la carga incluso en caso de error
      console.error('Error al cargar las máquinas:', error);
    }
  );
  }

  // Método para recibir el evento desde el modal de agregar máquina
  agregarMaquina(maquina: Maquina): void {
    // Agregar la nueva máquina a la lista de máquinas
    this.maquinas.push(maquina); 
  }
  
  // Método para seleccionar una máquina para editar
  seleccionarMaquina(maquina: Maquina) {
    this.maquinaSeleccionada = { ...maquina };
  }

  actualizarLista() {
    this.cargarMaquinas();
    this.cargando = false;
  }


  //eliminar maquina
  eliminarMaquina(id: number) {
    // Mostrar mensaje de confirmación
    Swal.fire({
      icon: 'warning',
      title: '¿Desea eliminar la máquina?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Mostrar loading mientras se elimina
        Swal.fire({
          title: 'Eliminando...',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        });
  
        // Llamar al servicio para eliminar la máquina
        this.maquinasService.eliminarMaquina(id).subscribe({
          next: () => {
            // Recargar la lista de máquinas
            this.actualizarLista();
            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Máquina eliminada!',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.error(err);
            // Mostrar mensaje de error
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar la máquina. Verifique si está relacionada con otros registros.',
            });
          }
        });
      }
    });
  }

 // Método para filtrar máquinas por nombre
 // Método para filtrar máquinas por nombre
filtrarMaquinas() {
  if (this.buscarTermino.trim() === '') {
    this.maquinas = this.maquinas; // Si no hay búsqueda, mostrar todas las máquinas
  } else {
    this.maquinas = this.maquinas.filter(maquina =>
      maquina.nombre.toLowerCase().includes(this.buscarTermino.toLowerCase())
    );
  }
}

// Método para actualizar el término de búsqueda
actualizarBusqueda() {
  this.filtrarMaquinas();
}

verMantenimiento(id: number) {
  this.router.navigate(['/detallemantenimientos', id]);
}

} 

