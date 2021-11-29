import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseOverTimeChartComponent } from './expense-over-time-chart.component';

describe('ExpenseOverTimeChartComponent', () => {
  let component: ExpenseOverTimeChartComponent;
  let fixture: ComponentFixture<ExpenseOverTimeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseOverTimeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseOverTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
