export interface Role {
    roleId: number;
    roleName: string;
    departmentId: number | null;
    departmentName?: string | null;
    locationName?: string | null;
    employees: [];
}
