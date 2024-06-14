export interface SelectedRolesFilter {
  department: number[];
  location: number[];
}

export function createDefaultSelectedRolesFilter():  SelectedRolesFilter {
  return {
    department: [],
    location: [],
  };
}