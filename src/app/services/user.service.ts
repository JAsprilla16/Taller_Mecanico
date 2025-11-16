import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  foto: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private firestore: Firestore) {}

  /**
   * Crear o actualizar un usuario en Firestore
   */
  async crearUsuario(usuario: Usuario): Promise<void> {
    const userRef = doc(this.firestore, `users/${usuario.uid}`);
    await setDoc(userRef, usuario);
  }

  /**
   * Obtener un usuario por su UID
   */
  async obtenerUsuario(uid: string): Promise<Usuario | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as Usuario) : null;
  }

  /**
   * Obtener un usuario por correo
   */
  async obtenerUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnap = await getDocs(q);
    if (querySnap.empty) return null;
    return querySnap.docs[0].data() as Usuario;
  }

  /**
   * Actualizar un usuario existente
   */
  async actualizarUsuario(uid: string, datos: Partial<Usuario>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, datos, { merge: true });
  }

  /**
   * Obtener todos los usuarios (opcional)
   */
  async obtenerTodosUsuarios(): Promise<Usuario[]> {
    const usersRef = collection(this.firestore, 'users');
    const querySnap = await getDocs(usersRef);
    return querySnap.docs.map(doc => doc.data() as Usuario);
  }

}

