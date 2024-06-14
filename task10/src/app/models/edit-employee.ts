export interface EditEmployee {
    firstName?: string| null;
    lastName?: string| null;
    dob?: Date| null;
    email?: string| null;
    mobileNumber?: string| null;
    joiningDate?: Date| null;
    locationId?: number | null;
    roleId?: number | null;
    departmentId?: number | null;
    managerId?: number | null;
    projectId?: number | null;
    profileImage?: File | null;
}