import { Injectable } from '@angular/core';
import { Firestore,  collection,  query,  where} from '@angular/fire/firestore';
import { getDocs } from '@angular/fire/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Repuesto } from '../models/repuesto';

@Injectable({ providedIn: 'root' })
export class ReportesService {

  constructor(private firestore: Firestore) {}

  // --- Helpers para rango de mes ---
  private monthRange(year: number, monthIndex0: number) {
    // monthIndex0: 0 = enero ... 11 = diciembre
    const start = new Date(year, monthIndex0, 1, 0, 0, 0, 0);
    const end = new Date(year, monthIndex0 + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

async ingresosPorMes(year: number, monthIndex0: number) {
  const { start, end } = this.monthRange(year, monthIndex0);

  const colRef = collection(this.firestore, 'ordenes');
  const q = query(
    colRef,
    where('fecha', '>=', Timestamp.fromDate(start)),
    where('fecha', '<=', Timestamp.fromDate(end)),
    where('estado', '==', 'Finalizado')
  );

  const snap = await getDocs(q);

  let total = 0;
  const detalles: Array<{ id: string; fecha: any; manoObra?: number; repuestosTotal: number; total?: number }> = [];

  snap.forEach(doc => {
    const data = doc.data() as any;
    const manoObra = data.manoObra ?? 0;
    const repuestos: Repuesto[] = data.repuestos ?? [];
    const repuestosTotal = repuestos.reduce((s, r) => s + (r.precio ?? 0) * (r.cantidad ?? 0), 0);
    const ordenTotal = (data.total ?? (manoObra + repuestosTotal));
    total += ordenTotal;

    detalles.push({
      id: doc.id,
      fecha: data.fecha,
      manoObra,
      repuestosTotal,
      total: ordenTotal
    });
  });

  return { total, detalles };
}


  // 2) Vehículos más frecuentes (top N) - cuenta órdenes por vehiculoId
  async vehiculosMasFrecuentes(limit = 10) {
    const colRef = collection(this.firestore, 'ordenes');
    const snap = await getDocs(colRef);
    const counts: Record<string, number> = {};

    snap.forEach(doc => {
      const data = doc.data() as any;
      const vid = data.vehiculoId ?? '(sin vehículo)';
      counts[vid] = (counts[vid] || 0) + 1;
    });

    const arr = Object.keys(counts).map(k => ({ vehiculoId: k, count: counts[k] }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, limit);
  }

  // 3) Servicios realizados - conteo por estado entre dos fechas (si no se pasan, toma todo)
  async serviciosPorEstado(from?: Date, to?: Date) {
    const colRef = collection(this.firestore, 'ordenes');

    // Si no hay filtro de fechas, simple conteo total
    if (!from || !to) {
      const snap = await getDocs(colRef);
      const counts: Record<string, number> = {};
      snap.forEach(doc => {
        const data = doc.data() as any;
        const estado = data.estado ?? 'Sin estado';
        counts[estado] = (counts[estado] || 0) + 1;
      });
      return Object.keys(counts).map(k => ({ estado: k, count: counts[k] }));
    }

    // Con rango de fechas
    const q = query(colRef, where('fecha', '>=', from), where('fecha', '<=', to));
    const snap = await getDocs(q);
    const counts: Record<string, number> = {};
    snap.forEach(doc => {
      const data = doc.data() as any;
      const estado = data.estado ?? 'Sin estado';
      counts[estado] = (counts[estado] || 0) + 1;
    });
    return Object.keys(counts).map(k => ({ estado: k, count: counts[k] }));
  }
}
