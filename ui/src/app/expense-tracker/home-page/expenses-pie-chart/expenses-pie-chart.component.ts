import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { GetExpensesService } from '../../services/get-expenses/get-expenses.service';
import { Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-expenses-pie-chart',
  templateUrl: './expenses-pie-chart.component.html',
  styleUrls: ['./expenses-pie-chart.component.css']
})
export class ExpensesPieChartComponent implements OnInit {

  @Output() expenseSummaryEvent = new EventEmitter<number[]>();

  pieChartDetails: any;
  public pieChartData: number[];


  chartOptions: any;

  hasApiError: boolean;
  isApiLoading: boolean;

  ngOnInit() {
    this.loadExpensePieChartData();

    if (this.isPieChartDataEmpty()) {
      this.isApiLoading = false;
      this.hasApiError = false;
      return;
    }
  }

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

  loadExpensePieChartData() {

    this.isApiLoading = true;
    this.hasApiError = false;

    this.getExpenseService.getExpenseDetailsByDateRange(this.startDateObject.value, this.endDateObject.value, "AGGREGATE")

      .subscribe(response => {
        if (response.responseType === "SUCCESS") {
          this.pieChartData = [
            Number(response.data?.home),
            Number(response.data?.groceries),
            Number(response.data?.uncommon),
            Number(response.data?.futile)
          ]; 
          this.expenseSummaryEvent.emit(this.pieChartData);


          this.pieChartDetails = {
            labels: ['Home', 'Groceries',  'Uncommon', 'Futile'],
            datasets: [
              {
                data: this.pieChartData,
                backgroundColor: [
                  "#0dcaf0",
                  "#198754",
                  "#ffc107",
                  "#dc3545" 
                ],
                hoverBackgroundColor: [
                  "#0989a2",
                  "#0a3622",
                  "#cc9a06",
                  "#87212a"

                ]
              }
            ]
          };

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
    return (this.pieChartData.length == 0) || (this.pieChartData.every(item => item === 0));
  }

}
