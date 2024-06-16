import { Component, ElementRef, inject, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';

import { CommonModule } from '@angular/common';
import { createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { SharedService } from '../../services/shared.service';
import { AlphabetFilterComponent } from '../alphabet-filter/alphabet-filter.component';
import { FILTER_CONFIG } from '../../config/filter-config';
import { Filter } from '../../models/filter';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { FilterDropdownConfig } from '../../models/filter-dropdown';
import { createDefaultSelectedRolesFilter, SelectedRolesFilter } from '../../models/selected-roles-filter';

@Component({
    selector: 'app-filter-bar',
    standalone: true,
    imports: [CommonModule, AlphabetFilterComponent, FilterDropdownComponent],
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.css', '../../pages/home/home.component.css']
})
export class FilterBarComponent implements OnInit {
    @Input() dropdowns: FilterDropdownConfig[] = [];
    @Input() isDisabled: boolean = true;
    @Input() selectedFilters: SelectedEmployeesFilter | SelectedRolesFilter | undefined;

    filters: Filter[] = FILTER_CONFIG;

    dropdownsVisible: { [key: string]: boolean } = {};

    @ViewChild('statusOptionsContainer') statusOptionsContainer!: ElementRef;
    @ViewChild('dropdownStatus') dropdownStatus!: ElementRef;
    @ViewChild('dropdownLocation') dropdownLocation!: ElementRef;
    @ViewChild('dropdownDepartment') dropdownDepartment!: ElementRef;
    @ViewChild('locationOptionsContainer') locationOptionsContainer!: ElementRef;
    @ViewChild('departmentOptionsContainer') departmentOptionsContainer!: ElementRef;
    @ViewChild('btnReset') btnReset!: ElementRef<HTMLButtonElement>;
    @ViewChild('btnApply') btnApply!: ElementRef<HTMLButtonElement>;
    @ViewChild('departmentBtnDiv') departmentBtnDiv!: ElementRef<HTMLButtonElement>;
    @ViewChild('statusBtnDiv') statusBtnDiv!: ElementRef<HTMLButtonElement>;
    @ViewChild('locationBtnDiv') locationBtnDiv!: ElementRef<HTMLButtonElement>;
    @ViewChildren('filterBtn') filterBtns!: QueryList<ElementRef<HTMLButtonElement>>;
    @ViewChildren('dropdownContent') dropdownContents!: QueryList<ElementRef<HTMLDivElement>>;
    @ViewChild(AlphabetFilterComponent) alphabetFilter!: AlphabetFilterComponent;

    constructor() {
    }

    sharedService = inject(SharedService);
    pageNumber: number = this.sharedService.getPageNumber();
    pageSize: number = this.sharedService.getPageSize();
    ngOnInit(): void {

        this.dropdowns.forEach(dropdown => {
            this.dropdownsVisible[dropdown.filterType] = false;
        });

        if (this.isRoleFilter(this.selectedFilters)) {
            this.selectedFilters = this.sharedService.getSelectedRolesFilters();

        } else if (this.isEmployeeFilter(this.selectedFilters)) {
            this.selectedFilters = this.sharedService.getSelectedEmployeesFilters();
        }

        this.sharedService.btnResetState$.subscribe(state => {
            if (this.btnReset && this.btnReset.nativeElement) {
                this.btnReset.nativeElement.disabled = state;
            }

        });
        this.sharedService.btnApplyState$.subscribe(state => {
            if (this.btnApply && this.btnApply.nativeElement) {
                this.btnApply.nativeElement.disabled = state;
            }
        });

        this.sharedService.pageNumber$.subscribe(pageNumber => {
            this.pageNumber = pageNumber;

        });

        this.sharedService.pageSize$.subscribe(pageSize => {
            this.pageSize = pageSize;
        });

        this.sharedService.alphabetActive$.subscribe(active => {
            if (this.btnReset.nativeElement) {
                this.btnReset.nativeElement.disabled = !active;
            }
            if (this.btnApply.nativeElement) {
                this.btnApply.nativeElement.disabled = !active;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedFilters']) {
            if (this.isRoleFilter(changes['selectedFilters'].currentValue)) {
                this.selectedFilters = createDefaultSelectedRolesFilter();
            } else if (this.isEmployeeFilter(changes['selectedFilters'].currentValue)) {
                this.selectedFilters = createDefaultSelectedEmployeesFilter();
            }
        }
    }

    populateDropdown(dropdown: string): void {
        Object.keys(this.dropdownsVisible).forEach(key => {
            if (key === dropdown) {
                this.dropdownsVisible[key] = !this.dropdownsVisible[key];
            } else {
                this.dropdownsVisible[key] = false;
            }
        });
    }

    selectOption(optionId: number, filterType: string): void {
        if (this.isEmployeeFilter(this.selectedFilters)) {
            const filter = this.selectedFilters[filterType as keyof SelectedEmployeesFilter];
            if (Array.isArray(filter)) {
                const index = filter.indexOf(optionId as never);
                if (index !== -1) {
                    filter.splice(index, 1);
                } else {
                    filter.push(optionId as never);
                }
                this.handleFilterBar();
            }
        } else if (this.isRoleFilter(this.selectedFilters)) {
            const filter = this.selectedFilters[filterType as keyof SelectedRolesFilter];
            if (Array.isArray(filter)) {
                const index = filter.indexOf(optionId as never);
                if (index !== -1) {
                    filter.splice(index, 1);
                } else {
                    filter.push(optionId as never);
                }
                this.handleFilterBar();
            }
        }
        this.sharedService.updateButtonStates(this.selectedFilters!);
    }

    handleFilterBar(): void {
        if (this.isEmployeeFilter(this.selectedFilters)) {
            const shouldDisable = this.sharedService.disableButtons(this.selectedFilters);
            this.sharedService.setBtnResetState(shouldDisable);
            this.sharedService.setBtnApplyState(shouldDisable);

            if (shouldDisable === true) {
                this.sharedService.loadEmployees();
            }
        } else if (this.isRoleFilter(this.selectedFilters)) {
            const shouldDisable = this.sharedService.disableButtons(this.selectedFilters);
            this.sharedService.setBtnResetState(shouldDisable);
            this.sharedService.setBtnApplyState(shouldDisable);

            if (shouldDisable === true) {
                this.sharedService.loadRoles();
            }
        }
    }

    resetFilter(): void {
        if (this.isEmployeeFilter(this.selectedFilters)) {
            this.sharedService.resetEmployeesFilters();
        } else if (this.isRoleFilter(this.selectedFilters)) {
            this.sharedService.resetRolesFilters();
        }
        this.sharedService.triggerAlphabetReset();
        this.sharedService.loadEmployees();

        const shouldDisable = !this.alphabetFilter.isFilterApplied() &&
            this.sharedService.disableButtons(this.selectedFilters!);

        this.sharedService.setBtnResetState(shouldDisable);
        this.sharedService.setBtnApplyState(shouldDisable);

        this.sharedService.updateButtonStates(this.selectedFilters!);
    }

    applyFilter(): void {

        this.sharedService.setPageNumber(1);
        if (this.isEmployeeFilter(this.selectedFilters)) {
            this.sharedService.setSelectedEmployeesFilters(this.selectedFilters);
            this.sharedService.loadEmployees(this.selectedFilters);
        } else if (this.isRoleFilter(this.selectedFilters)) {
            this.sharedService.setSelectedRolesFilters(this.selectedFilters);
            this.sharedService.loadRoles(this.selectedFilters);
        }

        const shouldDisable = !this.alphabetFilter.isFilterApplied() &&
            this.sharedService.disableButtons(this.selectedFilters!);

        this.sharedService.setBtnResetState(shouldDisable);
        this.sharedService.setBtnApplyState(shouldDisable);

        this.sharedService.updateButtonStates(this.selectedFilters!);
    }

    isSelected(optionId: number, filterType: string): boolean {
        if (this.isEmployeeFilter(this.selectedFilters)) {
            return this.selectedFilters[filterType as keyof SelectedEmployeesFilter]?.includes(optionId as never) || false;
        } else if (this.isRoleFilter(this.selectedFilters)) {
            return this.selectedFilters[filterType as keyof SelectedRolesFilter]?.includes(optionId as never) || false;
        }
        return false;
    }

    getSelectedOptions(filterType: string): number[] {
        if (this.isEmployeeFilter(this.selectedFilters)) {
            return this.selectedFilters[filterType as keyof SelectedEmployeesFilter] as number[] || [];
        } else if (this.isRoleFilter(this.selectedFilters)) {
            return this.selectedFilters[filterType as keyof SelectedRolesFilter] as number[] || [];
        }
        return [];
    }

    private isEmployeeFilter(filters: any): filters is SelectedEmployeesFilter {
        return 'status' in filters && 'location' in filters && 'department' in filters;
    }

    private isRoleFilter(filters: any): filters is SelectedRolesFilter {
        return !('status' in filters);
    }

}