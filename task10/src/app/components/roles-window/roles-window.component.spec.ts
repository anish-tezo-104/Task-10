import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesWindowComponent } from './roles-window.component';

describe('RolesWindowComponent', () => {
  let component: RolesWindowComponent;
  let fixture: ComponentFixture<RolesWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
