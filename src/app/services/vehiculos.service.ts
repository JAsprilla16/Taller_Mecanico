import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

export interface VehiculoPayload {
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
  constructor(private firestore: Firestore) {}

  // Devuelve un Observable que emite la promesa de creación
  crearVehiculo(payload: VehiculoPayload): Observable<any> {
    const colRef = collection(this.firestore, 'vehiculos');
    // añadimos createdAt con serverTimestamp para coherencia en DB
    const data = { ...payload, createdAt: serverTimestamp() };
    // from convierte la promesa en observable
    return from(addDoc(colRef, data));
  }
}