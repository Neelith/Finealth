import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuFormComponent } from './cu-form.component';

describe('CuFormComponent', () => {
  let component: CuFormComponent;
  let fixture: ComponentFixture<CuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CuFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
