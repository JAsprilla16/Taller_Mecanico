import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, updateDoc, deleteDoc, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

export interface Vehiculo {
  id?: string;
  placa: string;
  marca: string;
  modelo: string;
  color?: string;
  anho?: number;
  propietarioUid: string;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class VehiculosService {

    private vehiculosRef;

  constructor(private firestore: Firestore) {
    this.vehiculosRef = collection(this.firestore, 'vehiculos');
  }

  // Devuelve un Observable que emite la promesa de creación
  crearVehiculo(payload: Vehiculo): Observable<any> {
    const colRef = collection(this.firestore, 'vehiculos');
    // añadimos createdAt con serverTimestamp para coherencia en DB
    const data = { ...payload, createdAt: serverTimestamp() };
    // from convierte la promesa en observable
    return from(addDoc(colRef, data));
  }

   // 🔹 Admin → Obtener todos los vehículos
  obtenerVehiculos(): Observable<Vehiculo[]> {
    return collectionData(this.vehiculosRef, { idField: 'id' }) as Observable<
      Vehiculo[]
    >;
  }

  obtenerVehiculoPorId(id: string) {
  const ref = doc(this.firestore, `vehiculos/${id}`);
  return getDoc(ref);
}


  // 🔹 Admin → Actualizar vehículo
  actualizarVehiculo(id: string, data: Partial<Vehiculo>) {
    const ref = doc(this.firestore, `vehiculos/${id}`);
    return updateDoc(ref, data);
  }

  // 🔹 Admin → Eliminar vehículo
  eliminarVehiculo(id: string) {
    const ref = doc(this.firestore, `vehiculos/${id}`);
    return deleteDoc(ref);
  }
}