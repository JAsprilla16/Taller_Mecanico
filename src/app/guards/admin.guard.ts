import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const AdminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser;

  // Si no hay usuario logueado → al login
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Correo del administrador "designado"
  const adminEmail = "arcosasprillajose@gmail.com";

  // Validamos que el correo coincida 100%
  if (user.email === adminEmail) {
    return true; // SÍ ES ADMIN
  }

  // Si no es admin → lo mandamos al panel normal
  router.navigate(['/panel']);
  return false;
};
