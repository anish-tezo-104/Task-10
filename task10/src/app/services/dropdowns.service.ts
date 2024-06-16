import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Dropdown } from '../models/dropdown';
import { Status } from '../enums/status';
import { Role } from '../models/role';
import { ErrorCodes } from '../enums/error-codes';

@Injectable({
  providedIn: 'root'
})
export class DropdownsService {

  constructor(private http: HttpClient) { }

  getDepartmentList(): Observable<Dropdown[] > {
    return this.http.get<any>(`${environment.API_URL}/Api/DropDown/Departments`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error(`${response.statusCode} ${response.errorCode}`);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        } 
        else{
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    );
  }

  getLocationList(): Observable<Dropdown[]> {
    return this.http.get<any>(`${environment.API_URL}/Api/DropDown/Locations`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error(`${response.statusCode} ${response.errorCode}`);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        } else {
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    );
  }

  getStatusList(): Observable<Dropdown[]> {
    const statuses: Dropdown[] = this.enumToDropdown(Status);
    return of(statuses);
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<any>(`${environment.API_URL}/Api/Role`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error(`${response.statusCode} ${response.errorCode}`);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        } else {
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    )
  }

  getManagersList(): Observable<Dropdown[]> {
    return this.http.get<any>(`${environment.API_URL}/Api/DropDown/Managers`).pipe(
      map(
        response => {
          if (response.status === 'SUCCESS') {
            return response.data;
          } else {
            throw new Error(`${response.statusCode} ${response.errorCode}`);
          }
        }
      ),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        } else {
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
    )
  }

  getProjectsList(): Observable<Dropdown[]> {
    return this.http.get<any>(`${environment.API_URL}/Api/DropDown/Projects`).pipe(
      map(
        response => {
          if (response.status === 'SUCCESS') {
            return response.data;
          } else {
            throw new Error(`${response.statusCode} ${response.errorCode}`);
          }
        }
      ),
      catchError(error => {
        if (error.status === 404) {
          throw new Error(`${error.status} ${ErrorCodes.ERROR_OCCURRED}`);
        } else {
          if (error.status != 0) {
            throw new Error(`${error.status} ${ErrorCodes.UNKNOWN_ERROR.toString()}`);
          }
          throw new Error(`${ErrorCodes.UNKNOWN_ERROR.toString()}`);
        }
      })
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
