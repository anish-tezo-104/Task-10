import { Dropdown } from "./dropdown";

export interface FilterDropdownConfig {
  options: Dropdown[];
  filterType: string;
  defaultText: string;
}