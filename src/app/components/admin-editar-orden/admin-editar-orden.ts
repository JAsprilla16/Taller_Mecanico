import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { OrdenesService, OrdenPayload } from '../../services/ordenes.service';
import { Repuesto } from '../../models/repuesto';

@Component({
  selector: 'app-admin-editar-orden',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-editar-orden.html',
  styleUrls: ['./admin-editar-orden.css'],
})
export class AdminEditarOrdenComponent implements OnInit {

  ordenId!: string;
  orden!: OrdenPayload | null;

  cargando = true;
  mensaje = '';

  datosForm!: FormGroup;
  repuestoForm!: FormGroup;
  manoObraForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesService: OrdenesService,
    private fb: FormBuilder
  ) {
    // FORMULARIO DE DATOS ADMIN
    this.datosForm = this.fb.group({
      descripcion: [''],
      mecanicoId: [''],
    });

    // FORMULARIO REPUESTOS
    this.repuestoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    // FORMULARIO MANO DE OBRA
    this.manoObraForm = this.fb.group({
      manoObra: [0, [Validators.required, Validators.min(0)]],
    });
  }

  async ngOnInit() {
    this.ordenId = this.route.snapshot.paramMap.get('id')!;

    const snap = await this.ordenesService.obtenerOrdenPorId(this.ordenId);
    if (!snap.exists()) {
      this.mensaje = '❌ La orden no existe';
      return;
    }

    this.orden = snap.data() as OrdenPayload;
    this.cargando = false;

    this.datosForm.patchValue({
      descripcion: this.orden.descripcion ?? '',
      mecanicoId: this.orden.mecanicoId ?? '',
    });
  }

  cambiarEstado(nuevo: string) {
    this.ordenesService.cambiarEstado(this.ordenId, nuevo);
    this.mensaje = 'Estado actualizado ✔';
    setTimeout(() => this.mensaje = '', 1500);
  }

  async guardarDatos() {
    const cambios = this.datosForm.value;
    await this.ordenesService.actualizarOrden(this.ordenId, cambios);

    const snap = await this.ordenesService.obtenerOrdenPorId(this.ordenId);
    this.orden = snap.data() as OrdenPayload;

    this.mensaje = 'Datos guardados ✔';
    setTimeout(() => this.mensaje = '', 1500);
  }

  async agregarRepuesto() {
    if (this.repuestoForm.invalid) return;

    const repuesto: Repuesto = this.repuestoForm.value;

    await this.ordenesService.agregarRepuesto(this.ordenId, repuesto);

    this.mensaje = 'Repuesto agregado ✔';
    this.repuestoForm.reset({ nombre: '', precio: 0, cantidad: 1 });

    setTimeout(() => this.mensaje = '', 1500);
  }

  async actualizarCostos() {
    const manoObra = this.manoObraForm.value.manoObra;

    await this.ordenesService.actualizarCostos(this.ordenId, manoObra);

    this.mensaje = 'Costos actualizados ✔';
    setTimeout(() => this.mensaje = '', 1500);
  }

  volver() {
    this.router.navigate(['/admin/ordenes']);
  }
}


