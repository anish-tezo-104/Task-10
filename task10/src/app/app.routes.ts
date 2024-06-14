import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'Login',
        loadComponent: () => import('./components/login/login.component').then(mod => mod.LoginComponent)
    },
    {
        path: 'Employees',
        loadComponent: () => import('./components/employees-window/employees-window.component').then(mod => mod.EmployeesWindowComponent)
    },
    {
        path: 'Dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(mod => mod.DashboardComponent)
    },
    {
        path: 'Roles',
        loadComponent: () => import('./components/roles-window/roles-window.component').then(mod => mod.RolesWindowComponent)
    },
    {
        path: 'AccessUsers',
        loadComponent: () => import('./components/access-rights-window/access-rights-window.component').then(mod => mod.AccessRightsWindowComponent)
    },
    {
        path: 'AddEmployee',
        loadComponent: () => import('./components/employee-form/employee-form.component').then(mod => mod.EmployeeFormComponent)
    },
    {
        path: 'Edit/:id',
        loadComponent: () => import('./components/employee-form/employee-form.component').then(mod => mod.EmployeeFormComponent)
    },
    {
        path: 'Details/:id',
        loadComponent: () => import('./components/view-employee/view-employee.component').then(mod => mod.ViewEmployeeComponent)
    },
    {
        path: 'AddRole',
        loadComponent: () => import('./components/role-form/role-form.component').then(mod => mod.RoleFormComponent)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
