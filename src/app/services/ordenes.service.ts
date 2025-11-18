import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, doc, updateDoc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Repuesto } from '../models/repuesto';

/**
 * Modelo de orden.
 * - Campos básicos para cliente (vehiculoId, motivo, propietarioUid, estado)
 * - Campos opcionales para admin (descripcion, mecanicoId, repuestos, manoObra, total)
 */
export interface OrdenPayload {
  id?: string;
  vehiculoId: string;
  motivo: string;
  estado: string;
  propietarioUid: string;
  fecha?: any;

  // Campos administrativos (opcionales)
  descripcion?: string | null; 
  mecanicoId?: string | null;
  repuestos?: Repuesto[];
  manoObra?: number;
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  constructor(private firestore: Firestore) {}

  // -----------------------------
  // FUNCIONES PARA EL CLIENTE
  // -----------------------------

  /**
   * Crear una nueva orden desde el módulo cliente (solicitud básica).
   * Se guarda la fecha con serverTimestamp().
   */
  crearOrden(payload: OrdenPayload) {
    const ref = collection(this.firestore, 'ordenes');
    const data = { ...payload, fecha: serverTimestamp() };
    return addDoc(ref, data);
  }

  /**
   * Obtener las órdenes pertenecientes a un usuario (cliente).
   * Retorna un Observable en tiempo real.
   */
  obtenerOrdenesUsuario(uid: string): Observable<OrdenPayload[]> {
    const colRef = collection(this.firestore, 'ordenes');
    const q = query(colRef, where('propietarioUid', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<OrdenPayload[]>;
  }

  /**
   * Obtener historial general (puede usarse en cliente para ver todas sus órdenes).
   * Actualmente devuelve todas las órdenes (filtrado puede hacerse en el componente).
   */
  obtenerHistorial(): Observable<OrdenPayload[]> {
    const colRef = collection(this.firestore, 'ordenes');
    return collectionData(colRef, { idField: 'id' }) as Observable<OrdenPayload[]>;
  }

  // -----------------------------
  // FUNCIONES PARA EL ADMIN
  // -----------------------------

  /**
   * Obtener todas las órdenes del taller (vista admin).
   * Devuelve un Observable con idField para manejar en tablas.
   */
  obtenerTodasLasOrdenes(): Observable<OrdenPayload[]> {
    const colRef = collection(this.firestore, 'ordenes');
    return collectionData(colRef, { idField: 'id' }) as Observable<OrdenPayload[]>;
  }

  /**
   * Obtener una orden por su ID (consulta puntual).
   * Devuelve una Promise-like (DocumentSnapshot) para leer campos puntuales.
   */
  obtenerOrdenPorId(id: string) {
    const ref = doc(this.firestore, `ordenes/${id}`);
    return getDoc(ref);
  }

  /**
   * Actualizar campos generales de la orden (descripción, mecánico, etc.).
   * Usar para ediciones administrativas.
   */
  actualizarOrden(id: string, cambios: Partial<OrdenPayload>) {
    const ref = doc(this.firestore, `ordenes/${id}`);
    return updateDoc(ref, cambios);
  }

  /**
   * Cambiar el estado de una orden (pendiente → diagnóstico → reparación → finalizado).
   */
  cambiarEstado(id: string, nuevoEstado: string) {
    const ref = doc(this.firestore, `ordenes/${id}`);
    return updateDoc(ref, { estado: nuevoEstado });
  }

  /**
   * Agregar un repuesto simple (modelo A) a la orden.
   * - Lee la orden actual
   * - Añade el repuesto al array 'repuestos'
   * - Guarda el array actualizado
   */
  async agregarRepuesto(id: string, repuesto: Repuesto) {
    const ref = doc(this.firestore, `ordenes/${id}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const repuestos: Repuesto[] = data['repuestos'] ?? [];

    repuestos.push(repuesto);

    await updateDoc(ref, { repuestos });
  }

  /**
   * Actualizar mano de obra y recalcular el total (repuestos + mano de obra).
   * - Lee repuestos guardados en la orden
   * - Calcula total de repuestos (precio * cantidad)
   * - Suma manoObra y guarda manoObra y total en la orden
   */
  async actualizarCostos(id: string, manoObra: number) {
    const ref = doc(this.firestore, `ordenes/${id}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const repuestos: Repuesto[] = data['repuestos'] ?? [];

    const totalRepuestos = repuestos.reduce(
      (sum, r) => sum + (r.precio ?? 0) * (r.cantidad ?? 0),
      0
    );

    const total = totalRepuestos + (manoObra ?? 0);

    await updateDoc(ref, { manoObra, total });
  }

  /**
   * Obtener órdenes filtradas por estado (útil para filtros admin).
   */
  obtenerOrdenesPorEstado(estado: string): Observable<OrdenPayload[]> {
    const colRef = collection(this.firestore, 'ordenes');
    const q = query(colRef, where('estado', '==', estado));
    return collectionData(q, { idField: 'id' }) as Observable<OrdenPayload[]>;
  }

  /**
   * Obtener órdenes asociadas a un vehículo específico.
   */
  obtenerOrdenesPorVehiculo(vehiculoId: string): Observable<OrdenPayload[]> {
  const colRef = collection(this.firestore, 'ordenes');
  const q = query(colRef, where("vehiculoId", "==", vehiculoId));
  return collectionData(q, { idField: 'id' }) as Observable<OrdenPayload[]>;
}

}



