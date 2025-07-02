import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ReadExpensesService } from '../../services/read-expenses/read-expenses.service';
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

  constructor(private readExpenseService: ReadExpensesService) {
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

    this.readExpenseService.readExpenseDetailsByDateRange(this.startDateObject.value, this.endDateObject.value, "AGGREGATE")

      .subscribe(response => {
        if (response.responseType === "SUCCESS") {
          this.pieChartData = [
            Number(response.data?.home),
            Number(response.data?.groceries),
            Number(response.data?.uncommon),
            Number(response.data?.futile),
            Number(response.data?.vehicle)
          ]; 
          this.expenseSummaryEvent.emit(this.pieChartData);


          this.pieChartDetails = {
            labels: ['Home', 'Groceries',  'Uncommon', 'Futile', 'Vehicle'],
            datasets: [
              {
                data: this.pieChartData,
                backgroundColor: [
                  "#00aacb",
                  "#198754",
                  "#ffbf00",
                  "#dc3545",
                  "#a446d2" 
                ],
                hoverBackgroundColor: [
                  "#0989a2",
                  "#0a3622",
                  "#cc9a06",
                  "#87212a",
                  "#a204f0"

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
