import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role } from '../models/role';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { SelectedRolesFilter } from '../models/selected-roles-filter';
import { AddRole } from '../models/add-role';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  isLoading: boolean = false;

  constructor(private http: HttpClient) { }


  getRoles(filters?: SelectedRolesFilter, pageNumber?: number, pageSize?: number, search?: string ): Observable<Role[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.department && filters.department.length > 0) {
        filters.department.forEach(dept => {
          params = params.append('Departments', dept.toString());
        });
      }

    }
    if (search) {
      params = params.append('Search', search);
    }
    
    if (pageNumber && pageSize) {
      params = params.append('PageNumber', pageNumber.toString());
      params = params.append('PageSize', pageSize.toString());
    }

    const url = `${environment.API_URL}/Api/Role?${params.toString()}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
          return response.data as Role[];
        } else {
          return [];
        }
      })
    );
  }

  addRole(role: AddRole): Observable<any> {
    console.log(role);
    return this.http.post<any>(`${environment.API_URL}/Api/Role`, role).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          return null;
        }
      })
    )
  }
}
