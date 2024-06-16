export interface Employee {
    id: number;
    uid: string;
    status: boolean;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date | null;
    email: string;
    mobileNumber: string;
    joiningDate: Date | null;
    locationId: number | null;
    roleId: number | null;
    departmentId: number | null;
    managerId: number | null;
    isManager: boolean;
    projectId: number | null;
    locationName: string;
    departmentName: string;
    statusName: string;
    managerName: string;
    projectName: string;
    roleName: string;
    modeStatusId: number | null;
    modeStatusName: string;
    profileImageData?: string;
}
