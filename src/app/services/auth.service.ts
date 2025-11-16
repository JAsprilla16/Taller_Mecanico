import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from './user.service';   // <-- IMPORTANTE

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private userService: UserService   // <-- INYECTADO
  ) {
    this.user$ = user(this.auth);
  }

  async loginWithGoogle(): Promise<string | null> {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(this.auth, provider);

    const user = res.user;

    // Guardamos el usuario en Firestore para registro
    await this.userService.crearUsuario({
      uid: user.uid,
      nombre: user.displayName ?? '',
      email: user.email ?? '',
      foto: user.photoURL ?? '',
      rol: 'cliente'   // ya no importa, el admin es por correo
    });

    return user.email; // devolvemos el email del usuario
  }

  logout() {
    return signOut(this.auth);
  }
}

