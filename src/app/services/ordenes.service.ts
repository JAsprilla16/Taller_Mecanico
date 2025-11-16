import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface OrdenPayload {
  vehiculoId: string;
  motivo: string;
  estado: string;
  propietarioUid: string;
  fecha?: any;
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  constructor(private firestore: Firestore) {}

  // Crear una nueva orden de revisión
  crearOrden(payload: OrdenPayload) {
    const ref = collection(this.firestore, 'ordenes');
    const data = { ...payload, fecha: serverTimestamp() };
    return addDoc(ref, data);
  }

  // 🔹 Obtiene las órdenes de un usuario específico

obtenerOrdenesUsuario(uid: string): Observable<OrdenPayload[]> {
  const colRef = collection(this.firestore, 'ordenes');
  const q = query(colRef, where("propietarioUid", "==", uid));
  return collectionData(q, { idField: 'id' }) as Observable<OrdenPayload[]>;
}


  

  // 🔹 Obtiene el historial de servicios (por ahora simulado o desde otra colección)
  obtenerHistorial(): Observable<OrdenPayload[]> {
    const colRef = collection(this.firestore, 'ordenes');
    return collectionData(colRef, { idField: 'id' }) as Observable<OrdenPayload[]>;
  }
}


