import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authData = localStorage.getItem('authToken');

  if (authData === null) {
    router.navigateByUrl('/Login');
    return false;

  }
  return true;

};
