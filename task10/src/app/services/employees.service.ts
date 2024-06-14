import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '../../environments/environment.development';
import { DepartmentEmployeeGroup } from '../models/department-employee-group';
import { SelectedEmployeesFilter } from '../models/selected-employees-filter';
import { AddEmployee } from '../models/add-employee';
import { EditEmployee } from '../models/edit-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) { }

  getEmployeesGroupedByDepartment(): Observable<DepartmentEmployeeGroup[]> {
    const params = new HttpParams().set('GroupBy', "department");

    return this.http.get<any>(`${environment.API_URL}/Api/Employees`, { params }).pipe(

      map(response => {
        if (response.status === 'SUCCESS') {

          return response.data.map((item: any) => {
            return {
              departmentId: item.departmentId,
              departmentName: item.departmentName,
              employeesCount: item.employeesCount,
            } as DepartmentEmployeeGroup;
          });
        } else {
          throw new Error('Failed to fetch employees');
        }
      })
    );
  }

  // getEmployeesGroupedByDepartment(): Observable<DepartmentEmployeeGroup[]> {
  //   const params = new HttpParams().set('GroupBy', 'department');

  //   return this.http.get<any>(`${environment.API_URL}/Api/Employees`, { params }).pipe(
  //     map(response => {
  //       if (response.status === 'SUCCESS') {
  //         return Object.keys(response.data).map(key => {
  //           const item = response.data[key];
  //           return {
  //             departmentId: parseInt(key),
  //             departmentName: item[0]?.departmentName || 'N/A',
  //             employeesCount: item.length,
  //           } as DepartmentEmployeeGroup;
  //         });
  //       } else {
  //         throw new Error('Failed to fetch employees');
  //       }
  //     })
  //   );
  // }

  getEmployees(filters?: SelectedEmployeesFilter, pageNumber?: number, pageSize?: number, search?: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          params = params.append('Status', status.toString());
        });
      }
      if (filters.location && filters.location.length > 0) {
        filters.location.forEach(loc => {
          params = params.append('Locations', loc.toString());
        });
      }
      if (filters.department && filters.department.length > 0) {
        filters.department.forEach(dept => {
          params = params.append('Departments', dept.toString());
        });
      }
      if (filters.alphabet && filters.alphabet.length > 0) {
        filters.alphabet.forEach(alpha => {
          params = params.append('Alphabet', alpha);
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

    const url = `${environment.API_URL}/Api/Employees?${params.toString()}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
          return response.data as Employee[];
        } else {
          return [];
        }
      })
    );
  }

  countEmployees(): Observable<number>{
    return this.http.get<any>(`${environment.API_URL}/Api/Employees/Count`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to count employees');
        }
      })
    );
  }

  deleteEmployees(ids: number[]): Observable<any> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.delete<any>(`${environment.API_URL}/Api/Employees`, { params }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to delete employees');
        }
      })
    );
  }

  addEmployee(employee: AddEmployee, profileImage: File | null): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('employeeData', JSON.stringify(employee));
    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }

    return this.http.post<any>(`${environment.API_URL}/Api/Employees`, formData).pipe(
      map(event => {
        if (event.type === HttpEventType.Response) {
          const response = event.body;
          if (response.status === 'SUCCESS') {
            return response.data;
          } else {
            throw new Error('Failed to add employee');
          }
        }
        return null;
      })
    );
  }

  getEmployeeById(id: number): Observable<any> {
    console.log(`${environment.API_URL}Api/Employees?EmployeeId=${id}`);
    return this.http.get<any>(`${environment.API_URL}/Api/Employees?EmployeeId=${id}`).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data as any;
        } else {
          throw new Error('Failed to fetch employee');
        }
      })
    );
  }

  editEmployee(id: number, employee: EditEmployee, profileImage: File | null): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('employeeData', JSON.stringify(employee));
    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }
    return this.http.put<any>(`${environment.API_URL}/Api/Employees/${id}`, formData).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response.data;
        } else {
          throw new Error('Failed to edit employee');
        }
      })
    );
  }
}
