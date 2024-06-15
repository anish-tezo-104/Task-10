import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList,ViewChildren } from '@angular/core';
import {  createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter, } from '../../models/selected-employees-filter';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-alphabet-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabet-filter.component.html',
  styleUrls: ['./alphabet-filter.component.css', '../../pages/home/home.component.css']
})
export class AlphabetFilterComponent {
  alphabetArray: string[] = [];
  selectedFilters: SelectedEmployeesFilter = createDefaultSelectedEmployeesFilter();
  btnResetDisabled: boolean = true;
  btnApplyDisabled: boolean = true;

  constructor() { }


  @ViewChildren('alphBtn') alphBtns!: QueryList<ElementRef>;

  sharedService = inject(SharedService);
  pageNumber: number = 1;
  pageSize: number = 5;

  ngOnInit(): void {
    this.generateAlphabetArray();
    this.sharedService.selectedEmployeesFilters$.subscribe(filters => {
      this.selectedFilters = filters;
    });

    this.btnResetDisabled = this.sharedService.getBtnResetState();
    this.btnApplyDisabled = this.sharedService.getBtnApplyState();

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;
    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });

    this.sharedService.resetAlphabetButtons$.subscribe(() => {
      if (this.alphBtns) {
        this.alphBtns.forEach(btn => btn.nativeElement.classList.remove('active'));
      }
    });

  }

  isFilterApplied(): boolean {
    return (
      this.selectedFilters.alphabet.length > 0 ||
      this.selectedFilters.status.length > 0 ||
      this.selectedFilters.location.length > 0 ||
      this.selectedFilters.department.length > 0
    );
  }

  generateAlphabetArray(): void {
    for (let i = 65; i <= 90; i++) {
      this.alphabetArray.push(String.fromCharCode(i));
    }
  }

  alphabetButtonOnClick(alphabetIndex: number): void {
    const selectedBtn = this.alphBtns.toArray()[alphabetIndex];
    if (selectedBtn) {
      selectedBtn.nativeElement.classList.toggle("active");
      const alphabet = this.alphabetArray[alphabetIndex].toLowerCase();
      const index = this.selectedFilters.alphabet.indexOf(alphabet);
      if (index === -1) {
        this.selectedFilters.alphabet.push(alphabet);
      } else {
        this.selectedFilters.alphabet.splice(index, 1);
      }

      this.sharedService.setSelectedEmployeesFilters(this.selectedFilters);

      const shouldDisable = this.sharedService.updateButtonStates(this.selectedFilters);

      if (shouldDisable) {
        this.sharedService.loadEmployees();
        this.sharedService.setPageNumber(1);
        this.sharedService.setPageSize(5);
      }

      console.log('Selected filters:', this.selectedFilters);
    }
  }

  resetAlphabetButtons(): void {
    this.alphBtns.forEach(btn => {
      btn.nativeElement.classList.remove("active");
    });
  }
}
