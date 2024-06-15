import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = localStorage.getItem('authToken')?.replace(/"/g, '');;
  if (authToken && ["POST","PUT", "DELETE", "GET"].includes(req.method)) {
    const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
    })
    return next(cloneRequest);
  }
  return next(req);
};
