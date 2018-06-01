import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAreaComponent } from './property-area.component';

describe('PropertyAreaComponent', () => {
  let component: PropertyAreaComponent;
  let fixture: ComponentFixture<PropertyAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
