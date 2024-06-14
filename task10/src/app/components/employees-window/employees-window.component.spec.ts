import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesWindowComponent } from './employees-window.component';

describe('EmployeesWindowComponent', () => {
  let component: EmployeesWindowComponent;
  let fixture: ComponentFixture<EmployeesWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
