import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/Auth/Login`, { email, password }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to login');
        }
      })
    )
  }
}
