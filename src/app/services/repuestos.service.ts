import { Injectable } from '@angular/core';
import {  Firestore, collection, CollectionReference, addDoc, updateDoc, deleteDoc, doc, getDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Repuesto } from '../models/repuesto';

@Injectable({
  providedIn: 'root'
})
export class RepuestosService {

  private repuestosCollection!: CollectionReference<Repuesto>;

  constructor(private firestore: Firestore) {

    this.repuestosCollection = collection(
      this.firestore,'repuestos'
    ) as CollectionReference<Repuesto>;
  }

  // Editar repuesto
  actualizarRepuesto(id: string, repuesto: Repuesto) {
    const repuestoDoc = doc(this.firestore, `repuestos/${id}`);
    return updateDoc(repuestoDoc, { ...repuesto });
  }

  // Eliminar repuesto
  eliminarRepuesto(id: string) {
    const repuestoDoc = doc(this.firestore, `repuestos/${id}`);
    return deleteDoc(repuestoDoc);
  }

  // obtener inventario (observable)
  obtenerRepuestos(): Observable<Repuesto[]> {
    const colRef = collection(this.firestore, 'repuestos');
    // collectionData no devuelve id por defecto; si lo quieres, map manualmente.
    return collectionData(colRef, { idField: 'id' }) as Observable<Repuesto[]>;
  }

  // obtener repuesto puntual (snapshot)
  async obtenerRepuestoPorId(id: string) {
    const ref = doc(this.firestore, `repuestos/${id}`);
    return getDoc(ref);
  }

  // descontar stock (asegurando que no baje de 0)
  async descontarStock(id: string, qty: number) {
    const ref = doc(this.firestore, `repuestos/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Repuesto no encontrado');
    const data = snap.data() as any;
    const actual = data.cantidad ?? 0;
    const nuevo = Math.max(0, actual - qty);
    await updateDoc(ref, { cantidad: nuevo });
  }

  // aumentar stock (al eliminar repuesto de la orden)
  async aumentarStock(id: string, qty: number) {
    const ref = doc(this.firestore, `repuestos/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Repuesto no encontrado');
    const data = snap.data() as any;
    const actual = data.cantidad ?? 0;
    const nuevo = actual + qty;
    await updateDoc(ref, { cantidad: nuevo });
  }

  // crear / actualizar / eliminar si lo necesitas (ya tenías estos)
  async crearRepuesto(payload: Partial<Repuesto>) {
    const colRef = collection(this.firestore, 'repuestos');
    return addDoc(colRef, payload);
  }
}

