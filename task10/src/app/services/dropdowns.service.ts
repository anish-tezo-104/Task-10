import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Dropdown } from '../models/dropdown';
import { Status } from '../enums/status';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class DropdownsService {

  constructor(private http: HttpClient) { }

  getDepartmentList(): Observable<Dropdown[]> {
    return this.http.get<{ status: string, data: Dropdown[] }>(`${environment.API_URL}/Api/DropDown/Departments`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to fetch departments');
        }
      })
    );
  }

  getLocationList(): Observable<Dropdown[]> {
    return this.http.get<{ status: string, data: Dropdown[] }>(`${environment.API_URL}/Api/DropDown/Locations`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to fetch locations');
        }
      })
    );
  }

  getStatusList(): Observable<Dropdown[]> {
    const statuses: Dropdown[] = this.enumToDropdown(Status);
    return of(statuses);
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<{ status: string, data: Role[] }>(`${environment.API_URL}/Api/Role`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to fetch roles');
        }
      })
    )
  }

  getManagersList(): Observable<Dropdown[]> {
    return this.http.get<{ status: string, data: Dropdown[] }>(`${environment.API_URL}/Api/DropDown/Managers`).pipe(
      map(
        response => {
          if (response.status === 'SUCCESS') {
            return response.data;
          } else {
            throw new Error('Failed to fetch managers');
          }
        }
      )
    )
  }

  getProjectsList(): Observable<Dropdown[]>{
     return this.http.get<{ status: string, data: Dropdown[] }>(`${environment.API_URL}/Api/DropDown/Projects`).pipe(
      map(
        response => {
          if (response.status === 'SUCCESS') {
            return response.data;
          } else {
            throw new Error('Failed to fetch managers');
          }
        }
      )
    )
  }

  enumToDropdown(enumObj: any): Dropdown[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => {
        return {
          id: enumObj[key],
          name: key
        } as Dropdown;
      });
  }

}
