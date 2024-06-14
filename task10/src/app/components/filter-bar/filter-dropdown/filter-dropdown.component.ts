import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dropdown } from '../../../models/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css', '../filter-bar.component.css']
})
export class FilterDropdownComponent {
  @Input() options: Dropdown[] = [];
  @Input() selectedOptions: number[] = [];
  @Input() defaultText: string = 'Select'; 
  isOpen: boolean = false; 

  @Output() optionSelected = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(optionId: number): void {
    this.optionSelected.emit(optionId);
    this.isOpen = false; // Close dropdown after selection
  }

  isSelected(optionId: number): boolean {
    return this.selectedOptions.includes(optionId);
  }
}
