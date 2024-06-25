import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

export const canActivateGuard: CanActivateFn = (route, state) => {
  console.log('canActivateGuard');

  const localService = inject(LocalStorageService);
  const isLoggedIn = localService.getLoggedIn();
  const router = inject(Router);

  if (isLoggedIn === '1') {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
