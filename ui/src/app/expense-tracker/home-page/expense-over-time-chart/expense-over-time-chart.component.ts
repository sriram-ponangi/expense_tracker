import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GetExpensesService } from '../../services/get-expenses/get-expenses.service';




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

    stackedData: any;
    stackedOptions: any;


    chartLabels: string[];
    homeExpenses: number[];
    groceryExpenses: number[];
    uncommonExpense: number[];
    futileExpenses: number[];
    averageExpense: number[];


    constructor(private getExpenseService: GetExpensesService) {
        this.hasApiError = false;
        this.isApiLoading = true;

        this.chartLabels = [];
        this.homeExpenses = [];
        this.groceryExpenses = [];
        this.uncommonExpense = [];
        this.futileExpenses = [];
        this.averageExpense = [];

        let today = new Date();
        this.startDateObject = new FormControl(today.getFullYear() + "-01");
        this.endDateObject = new FormControl(today.getFullYear() + "-12");
        this.setStackerBarChartOptions();

    }

    ngOnInit(): void {
        this.loadExpenseHistoryBarChartData();

        if (this.isBarChartDataEmpty()) {
            this.isApiLoading = false;
            this.hasApiError = false;
            return;
        }


    }


    isBarChartDataEmpty() {
        console.log(this.chartLabels);
        return (this.chartLabels.length == 0);
    }


    loadExpenseHistoryBarChartData() {
        this.setEmptyData();
        this.isApiLoading = true;
        this.hasApiError = false;

        this.getExpenseService.getMonthlyExpenseHistoryByDateRange(this.startDateObject.value, this.endDateObject.value)

            .subscribe(next => {
                if (next.responseType === "SUCCESS") {
                    let monthlyExpensesList = next.data;
                    for (let expense in monthlyExpensesList) {
                        this.chartLabels.push(monthlyExpensesList[expense].month);
                        this.homeExpenses.push(monthlyExpensesList[expense].home);
                        this.groceryExpenses.push(monthlyExpensesList[expense].groceries);
                        this.uncommonExpense.push(monthlyExpensesList[expense].uncommon);
                        this.futileExpenses.push(monthlyExpensesList[expense].futile);

                        let total = monthlyExpensesList[expense].home + monthlyExpensesList[expense].groceries + monthlyExpensesList[expense].uncommon + monthlyExpensesList[expense].futile;
                        this.averageExpense.push(total);
                    }

                    const sum = this.averageExpense.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.averageExpense.length) || 0;
                    this.averageExpense.forEach((name, index) => this.averageExpense[index] = avg);

                    this.stackedData = {
                        labels: this.chartLabels,
                        datasets: [
                            {
                                type: 'line',
                                label: 'Average Expense',
                                data: this.averageExpense,
                                fill: true,
                                borderColor: '#FFA726',
                                tension: .4,
                                backgroundColor: 'rgba(255,167,38,0.2)'
                            },
                            {
                                type: 'bar',
                                label: 'Home',
                                backgroundColor: "#0dcaf0",
                                data: this.homeExpenses
                            },
                            {
                                type: 'bar',
                                label: 'Groceries',
                                backgroundColor: "#198754",
                                data: this.groceryExpenses
                            },
                            {
                                type: 'bar',
                                label: 'Uncommon',
                                backgroundColor: "#ffc107",
                                data: this.uncommonExpense
                            },
                            {
                                type: 'bar',
                                label: 'Futile',
                                backgroundColor: "#dc3545",
                                data: this.futileExpenses
                            },
                        ]
                    }

                }
            }, error => {
                console.error(error);
                this.hasApiError = true;
                this.isApiLoading = false;
            }, () => { // complete
                this.isApiLoading = false;
            });
    }

    setEmptyData() {
        this.averageExpense = [];
        this.chartLabels = [];
        this.homeExpenses = [];
        this.groceryExpenses = [];
        this.uncommonExpense = [];
        this.futileExpenses = [];
    }








    setStackerBarChartOptions() {
        this.stackedOptions = {
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                }
            },
            responsive: true,

            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            }
        };
    }




}
