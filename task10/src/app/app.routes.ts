import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { authChildGuard } from './auth/auth-child.guard';

export const routes: Routes = [

    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent),
        canActivate: [authGuard],
        canActivateChild: [authChildGuard],
        children: [
            {
                path: 'Employees',
                loadComponent: () => import('./pages/employees-window/employees-window.component').then(mod => mod.EmployeesWindowComponent),
                canActivate: [authGuard]
            },
            {
                path: 'Dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(mod => mod.DashboardComponent),
                canActivate: [authGuard]
            },
            {
                path: 'Roles',
                canActivate: [authGuard],
                canActivateChild: [authChildGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./pages/roles-window/roles-window.component').then(mod => mod.RolesWindowComponent),
                    },
                    {
                        path: ':roleId',
                        loadComponent: () => import('./pages/view-roles-employees/view-roles-employees.component').then(mod => mod.ViewRolesEmployeesComponent),
                    },
                ]
            },

            {
                path: 'AccessUsers',
                loadComponent: () => import('./pages/access-rights-window/access-rights-window.component').then(mod => mod.AccessRightsWindowComponent),
                canActivate: [authGuard]
            },
            {
                path: 'AddEmployee',
                loadComponent: () => import('./components/employee-form/employee-form.component').then(mod => mod.EmployeeFormComponent),
                canActivate: [authGuard]
            },
            {
                path: 'Edit/:id',
                loadComponent: () => import('./components/employee-form/employee-form.component').then(mod => mod.EmployeeFormComponent),
                canActivate: [authGuard]
            },
            {
                path: 'Details/:id',
                loadComponent: () => import('./components/view-employee/view-employee.component').then(mod => mod.ViewEmployeeComponent),
                canActivate: [authGuard]
            },
            {
                path: 'AddRole',
                loadComponent: () => import('./components/role-form/role-form.component').then(mod => mod.RoleFormComponent),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'Login'
    }
];
