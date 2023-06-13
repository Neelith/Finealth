import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTableComponent } from './r-table.component';

describe('RTableComponent', () => {
  let component: RTableComponent;
  let fixture: ComponentFixture<RTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
