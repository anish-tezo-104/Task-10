import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { AuthService } from './auth.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = localStorage.getItem('authToken')?.replace(/"/g, '');
  const authUser = JSON.parse(localStorage.getItem('authUser') || '[]');;

  let clonedRequest = req;
  const toast = inject(ToasterService);

  if (authToken && ["POST", "PUT", "DELETE", "GET"].includes(req.method)) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  const router = inject(Router);
  const authService = inject(AuthService);

  return next(clonedRequest).pipe(
    catchError(error => {
      if (!authService.isAuthenticated() || error.status === 401) {
        authService.logout(authUser.id).subscribe({
          next: () => {
          },
          complete: () => {
            localStorage.clear();
            toast.showErrorToaster(`${error.status} Error occurred`);
            router.navigate(['/Login']);
          }
        })
      }
      return throwError(() => error);
    })
  );
};
