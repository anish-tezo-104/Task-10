import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from '../services/toaster.service';

export const authChildGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToasterService);

  const authData = localStorage.getItem('authToken');


  let logged = authService.isAuthenticated();

  if (authData != null && logged) {
    
    return true;
  }

  router.navigate(['/Login']);
  return false;
};
