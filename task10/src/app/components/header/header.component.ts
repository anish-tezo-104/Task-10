import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../app.component.css']
})
export class HeaderComponent  {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('sidebarHandleIcon') sidebarHandleIcon!: ElementRef;
  @ViewChild('sidebarRolesIcon') sidebarRolesIcon!: ElementRef;
  @ViewChild('sidebarAssignUserIcon') sidebarAssignUserIcon!: ElementRef;
  @ViewChild('dropdownContentHeader', { static: false })
  dropdownContentRef!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private sharedService : SharedService) { }

  toggleSideBar(): void {
    if (this.sidebar && this.gridContainer && this.sidebarHandleIcon) {
      const sideBar = this.sidebar.nativeElement;
      const gridContainer = this.gridContainer.nativeElement;
      if (sideBar.classList.contains("active")) {
        sideBar.classList.remove("active");
        gridContainer.style.gridTemplateColumns = "6% 94%";
        this.updateIconPadding('0.5rem');
        this.sidebarHandleIcon.nativeElement.style.transform = "rotate(-180deg)";
      } else {
        sideBar.classList.add("active");
        gridContainer.style.gridTemplateColumns = "20% 80%";
        this.updateIconPadding('1rem');
        this.sidebarHandleIcon.nativeElement.style.transform = "rotate(360deg)";
      }
    }
  }

  handleSearch(event: any): void {
    if (event.key === 'Enter') {
      const searchKeyword = this.searchInput.nativeElement.value.trim();
      this.sharedService.searchEmployees(searchKeyword);
      this.sharedService.searchRoles(searchKeyword);
    }
  }

  private updateIconPadding(padding: string): void {
    if (this.sidebarRolesIcon) this.sidebarRolesIcon.nativeElement.style.paddingLeft = padding;
    if (this.sidebarAssignUserIcon) this.sidebarAssignUserIcon.nativeElement.style.paddingLeft = padding;
  }

  handleBurger(): void {
    if (this.dropdownContentRef) {
      const dropdownContent = this.dropdownContentRef.nativeElement as HTMLElement;
      if (dropdownContent.classList.contains("active")) {
        dropdownContent.classList.remove("active");
      } else {
        dropdownContent.classList.add("active");
      }
    }
  }
}