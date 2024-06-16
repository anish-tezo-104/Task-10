import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolesEmployeesComponent } from './view-roles-employees.component';

describe('ViewRolesEmployeesComponent', () => {
  let component: ViewRolesEmployeesComponent;
  let fixture: ComponentFixture<ViewRolesEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRolesEmployeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRolesEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
