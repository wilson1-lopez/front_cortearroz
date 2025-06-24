import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RepuestosService } from '../../servicios/repuestos.service';
import { ProveedoresService } from '../../servicios/proveedores.service';
import { MantenimientosService } from '../../servicios/mantenimientos.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './mantenimientos.component.html',
  styleUrl: './mantenimientos.component.css'
})
export class MantenimientosComponent implements OnInit {
  formularioMantenimiento!: FormGroup;
  maquinaId!: number;
  id: any;
  repuestosDisponibles: any[] = [];
  repuestosCatalogo: any[] = [];
  proveedoresCatalogo: any[] = [];
  apiUrl = 'http://localhost:8000/api/mantenimientos/completo';
  enviando = false;
  totalMantenimiento: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private repuestosService: RepuestosService,
    private router : Router,
    private proveedoresService: ProveedoresService,
    private mantenimientosService: MantenimientosService // <-- nuevo servicio
  ) {}

  ngOnInit() {
    this.obtenerProveedores();
    this.obtenerRepuestos();
    this.maquinaId = Number(this.route.snapshot.paramMap.get('id'));
    this.formularioMantenimiento = this.fb.group({
      maquina_id: [this.maquinaId],
      fecha: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      realizado_por: ['', Validators.required],
      repuestos: this.fb.array([], [this.minLengthArray(1)]),
      acciones: this.fb.array([], [this.minLengthArray(1)])
    });

    // Recalcular total cuando cambian los repuestos
    this.formularioMantenimiento.get('repuestos')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  get repuestos(): FormArray {
    return this.formularioMantenimiento.get('repuestos') as FormArray;
  }

  get acciones(): FormArray {
    return this.formularioMantenimiento.get('acciones') as FormArray;
  }

  obtenerProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe(
      {
        next: (data) => {
          this.proveedoresCatalogo = data;
          console.log('Proveedores:', data);
        },
        error: (error) => console.error('Error al cargar los proveedores:', error)
      }
    );
  }

  obtenerRepuestos() {
    this.repuestosService.obtenerRepuestos().subscribe(
      {
        next: (data) => {
          this.repuestosCatalogo = data;
          console.log('Repuestos disponibles:', this.repuestosCatalogo);
        },
        error: (error) => console.error('Error al cargar los repuestos:', error)
      }
    );
  }

  agregarRepuesto() {
    this.repuestos.push(this.fb.group({
      repuesto_id: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precio_proveedor: [null, [Validators.required, Validators.min(0)]],
      forma_pago: ['', Validators.required] // <-- nuevo campo requerido por repuesto
    }));
  }

  eliminarRepuesto(idx: number) {
    this.repuestos.removeAt(idx);
    this.calcularTotal();
  }

  onRepuestoChange(idx: number) {
    const repuestoForm = this.repuestos.at(idx) as FormGroup;
    const repuestoId = repuestoForm.get('repuesto_id')?.value;
    const proveedorId = repuestoForm.get('proveedor_id')?.value;
    if (repuestoId && proveedorId) {
      const rep = this.repuestosCatalogo.find(
        (r: any) => r.id === repuestoId && r.proveedor_id === proveedorId
      );
      if (rep) {
        repuestoForm.get('precio_proveedor')?.setValue(rep.precio);
      }
    }
    this.calcularTotal();
  }

  onProveedorChange(idx: number) {
    this.onRepuestoChange(idx);
  }

  calcularTotal() {
    let total = 0;
    this.repuestos.controls.forEach((ctrl: any) => {
      const cantidad = Number(ctrl.get('cantidad')?.value) || 0;
      const precioProveedor = Number(ctrl.get('precio_proveedor')?.value) || 0;
      total += cantidad * precioProveedor;
    });
    this.totalMantenimiento = total;
  }

  agregarAccion() {
    this.acciones.push(this.fb.group({
      descripcion: ['', Validators.required]
    }));
  }

  eliminarAccion(idx: number) {
    this.acciones.removeAt(idx);
  }

  registrarMantenimiento() {
    if (this.formularioMantenimiento.invalid) return;
    this.enviando = true;
    const datos = this.formularioMantenimiento.getRawValue();

    const repuesto_proveedores = datos.repuestos.map((r: any) => ({
      repuesto_id: String(r.repuesto_id),
      proveedor_id: String(r.proveedor_id),
      valor: null
    }));

    const repuesto_mantenimiento = datos.repuestos.map((r: any) => ({
      repuesto_id: String(r.repuesto_id),
      cantidad: r.cantidad,
      precio_proveedor: r.precio_proveedor,
      forma_pago: r.forma_pago
    }));

    const payload = {
      maquina_id: datos.maquina_id,
      fecha: datos.fecha,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      realizado_por: datos.realizado_por,
      repuesto_proveedores,
      repuesto_mantenimiento,
      acciones: datos.acciones
    };

    // Enviar al backend
    this.mantenimientosService.crearMantenimiento(payload).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Mantenimiento registrado',
          text: 'El mantenimiento se registró correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.enviando = false;
          this.router.navigate([`/detallemantenimientos/${this.maquinaId}`]);
        });
      },
      error: (err) => {
        this.enviando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el mantenimiento.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Validador personalizado para requerir al menos un elemento en el FormArray
  minLengthArray(min: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minLengthArray: true };
      }
      return null;
    };
  }
}

