import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessorryComponent } from './edit-accessorry.component';

describe('EditAccessorryComponent', () => {
  let component: EditAccessorryComponent;
  let fixture: ComponentFixture<EditAccessorryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccessorryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAccessorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
