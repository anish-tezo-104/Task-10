import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [

    {
        path: 'Login',
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent)
    },
    {
        path: '',
        component: HomeComponent,
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
                loadComponent: () => import('./pages/roles-window/roles-window.component').then(mod => mod.RolesWindowComponent),
                canActivate: [authGuard]
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
            },
        ]
    }
];
