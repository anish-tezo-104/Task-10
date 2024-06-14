export interface SelectedEmployeesFilter {
  alphabet: string[];
  status: number[];
  location: number[];
  department: number[];
}

export function createDefaultSelectedEmployeesFilter(): SelectedEmployeesFilter {
  return {
    alphabet: [],
    status: [],
    location: [],
    department: [],
  };
}
