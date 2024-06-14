export interface AddEmployee {
    uid: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    mobileNumber: string;
    joiningDate: Date;
    locationId: number | null;
    roleId: number | null;
    departmentId: number | null;
    managerId: number | null;
    projectId: number | null;
}