import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-expense-over-time-chart',
  templateUrl: './expense-over-time-chart.component.html',
  styleUrls: ['./expense-over-time-chart.component.css']
})
export class ExpenseOverTimeChartComponent implements OnInit {

  hasApiError: boolean;
  isApiLoading: boolean;

  startDateObject: FormControl;
  endDateObject: FormControl;

  barChartLabels: string[] = ['expenses'];
  public barChartData: number[] = [

  ];


  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = {
    responsive: true,

  };

  constructor() {
    this.hasApiError = false;
    this.isApiLoading = true;

    let today = new Date();
    this.startDateObject = new FormControl(today.getFullYear() + "-01");
    this.endDateObject = new FormControl(today.getFullYear() + "-12");
  }

  ngOnInit(): void {
    this.isBarChartDataEmpty();
    if (this.isBarChartDataEmpty()) {
      this.isApiLoading = false;
      this.hasApiError = false;
    }
  }

  loadExpenseHistoryBarChartData() {
    this.isApiLoading = true;
    this.hasApiError = false;
    let startMonthString = this.startDateObject.value.split("-");
    let endMonthString = this.startDateObject.value.split("-");
    console.log(new Date(Number(startMonthString[0]), Number(startMonthString[1]), 1));
    console.log(new Date(Number(endMonthString[0]), Number(endMonthString[1]), 0));


    // API CALL and FILL CHART DATA



    this.isApiLoading = false;

  }

  isBarChartDataEmpty() {
    return (this.barChartData.length == 0) || (this.barChartData.every(item => item === 0));
  }

}
