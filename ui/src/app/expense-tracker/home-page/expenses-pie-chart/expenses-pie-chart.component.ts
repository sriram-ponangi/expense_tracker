import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chart, ChartDataSets, ChartOptions, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { GetExpensesService } from '../../services/get-expenses/get-expenses.service';
import { Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-expenses-pie-chart',
  templateUrl: './expenses-pie-chart.component.html',
  styleUrls: ['./expenses-pie-chart.component.css']
})
export class ExpensesPieChartComponent implements OnInit {

  @Output() expenseSummaryEvent = new EventEmitter<number[]>();

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[] = ['Groceries', 'Home', 'Uncommon', 'Futile'];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };  
  public pieChartColors = [
    {
      backgroundColor: [
        'rgb(178, 255, 89)', //Groceries            
        'rgb(0, 184, 212)', //Home           
        'rgb(255, 255, 0)', //Uncommon
        'rgb(255, 61, 0)' //Futile
      ],
    },
  ];

  public pieChartData: number[];
  
  hasApiError: boolean;
  isApiLoading: boolean;

  startDateObject: FormControl;
  endDateObject: FormControl;

  constructor(private getExpenseService: GetExpensesService) {
    this.pieChartData = [];

    this.hasApiError = false;
    this.isApiLoading = true;

    let today = new Date();
    this.startDateObject = new FormControl(
      new Date(today.getFullYear(),
        today.getMonth(), 1)
        .toISOString().split('T')[0]
    );
    this.endDateObject = new FormControl(
      new Date(today.getFullYear(),
        today.getMonth() + 1, 0)
        .toISOString().split('T')[0]
    );
  }

  ngOnInit(): void {
    this.loadExpensePieChartData();
    if (this.isPieChartDataEmpty()) {
      this.isApiLoading = false;
      this.hasApiError = false;
    } 
  }

  loadExpensePieChartData() {

    this.isApiLoading = true;
    this.hasApiError = false;

    this.getExpenseService.getExpenseDetails(this.startDateObject.value, this.endDateObject.value, "AGGREGATE")
      .subscribe(response => {
        if (response.responseType === "SUCCESS") {
          this.pieChartData = [
            Number(response.data?.groceries),
            Number(response.data?.home),
            Number(response.data?.uncommon),
            Number(response.data?.futile)
          ]; 

          this.expenseSummaryEvent.emit(this.pieChartData);
        }
      }, error => {
        console.error(error);
        this.hasApiError = true;
        this.isApiLoading = false;
      }, () => { // complete
        this.isApiLoading = false;
      });
  }

  isPieChartDataEmpty() {
    // console.log(this.pieChartData);
    return (this.pieChartData.length == 0) || (this.pieChartData.every(item => item === 0));
  }

}
