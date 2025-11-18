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
async loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  // 🔹 Esto obliga a mostrar las cuentas SIEMPRE
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const res = await signInWithPopup(this.auth, provider);
  return res; 
}

  logout() {
    return signOut(this.auth);
  }
}

