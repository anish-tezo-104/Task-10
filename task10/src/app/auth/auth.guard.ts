import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from '../services/toaster.service';
import { ErrorCodes } from '../enums/error-codes';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToasterService)

  const authToken = localStorage.getItem('authToken');
  const authUser = JSON.parse(localStorage.getItem('authUser') || '[]');

  let logged = authService.isAuthenticated();

  if (authToken != null || logged) {
    return true;
  }
  else {
    authService.logout(authUser.id).subscribe({
      complete: () => {
        toast.showErrorToaster(ErrorCodes.PLEASE_LOGIN);
        localStorage.clear();
        router.navigate(['/Login']);
      }
    });
    return false;
  }
};
