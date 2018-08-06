import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRegisterComponent } from './tech-register.component';

describe('TechRegisterComponent', () => {
  let component: TechRegisterComponent;
  let fixture: ComponentFixture<TechRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
