import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

export const AdminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const adminEmail = 'arcosasprillajose@gmail.com';

  // Espera a que Firebase devuelva el usuario real
  const user = await firstValueFrom(authService.user$.pipe(take(1)));

  if (user && user.email === adminEmail) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};


