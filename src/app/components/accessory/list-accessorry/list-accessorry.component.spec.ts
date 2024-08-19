import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccessorryComponent } from './list-accessorry.component';

describe('ListAccessorryComponent', () => {
  let component: ListAccessorryComponent;
  let fixture: ComponentFixture<ListAccessorryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAccessorryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAccessorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
