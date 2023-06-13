import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMovementsPageComponent } from './cash-movements-page.component';

describe('CashMovementsPageComponent', () => {
  let component: CashMovementsPageComponent;
  let fixture: ComponentFixture<CashMovementsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CashMovementsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashMovementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
