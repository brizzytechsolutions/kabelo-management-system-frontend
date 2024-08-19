import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessorryComponent } from './add-accessorry.component';

describe('AddAccessorryComponent', () => {
  let component: AddAccessorryComponent;
  let fixture: ComponentFixture<AddAccessorryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccessorryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccessorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
