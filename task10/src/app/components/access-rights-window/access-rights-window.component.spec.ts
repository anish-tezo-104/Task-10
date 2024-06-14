import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRightsWindowComponent } from './access-rights-window.component';

describe('AccessRightsWindowComponent', () => {
  let component: AccessRightsWindowComponent;
  let fixture: ComponentFixture<AccessRightsWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRightsWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessRightsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
