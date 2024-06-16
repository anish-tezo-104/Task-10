import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ErrorCodes } from '../enums/error-codes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/Auth/Login`, { email, password }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error(ErrorCodes.FAILED_TO_LOGIN);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        }
        else if (error.status === 401) {
          throw new Error(`${error.status} ${ErrorCodes.INVALID_CREDENTIALS}`)
        } else {
          if (error.status != 0) {
            if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    )
  }

  logout(id : number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/Auth/Logout?EmployeeId=${id}`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error(ErrorCodes.FAILED_TO_LOGOUT);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        }
        else if (error.status === 401) {
          throw new Error(`${error.status} ${ErrorCodes.PLEASE_LOGIN}`)
        } else {
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    )
  }

  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('authToken');
    const authUser = localStorage.getItem('authUser');

    const parsedAuthUser = authUser ? JSON.parse(authUser) : null;

    if (authToken && parsedAuthUser && parsedAuthUser.isAuthenticated == true) {
      return true;
    }
    return false;
  }
}
