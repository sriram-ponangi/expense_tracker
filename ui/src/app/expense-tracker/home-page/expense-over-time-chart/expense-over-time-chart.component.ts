import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-expense-over-time-chart',
  templateUrl: './expense-over-time-chart.component.html',
  styleUrls: ['./expense-over-time-chart.component.css']
})
export class ExpenseOverTimeChartComponent implements OnInit {

  // hasApiError: boolean;
  // isApiLoading: boolean;

  // startDateObject: FormControl;
  // endDateObject: FormControl;

  // barChartLabels: string[] = ['expenses'];
  // public barChartData: any = {};


  // barChartType: string = 'bar';
  // barChartOptions: any = {
  //   responsive: true,

  // };

  // constructor() {
  //   this.hasApiError = false;
  //   this.isApiLoading = true;

  //   let today = new Date();
  //   this.startDateObject = new FormControl(today.getFullYear() + "-01");
  //   this.endDateObject = new FormControl(today.getFullYear() + "-12");
  // }

  // ngOnInit(): void {
  //   this.isBarChartDataEmpty();
  //   if (this.isBarChartDataEmpty()) {
  //     this.isApiLoading = false;
  //     this.hasApiError = false;
  //   }
  // }

  // loadExpenseHistoryBarChartData() {
  //   this.isApiLoading = true;
  //   this.hasApiError = false;
  //   let startMonthString = this.startDateObject.value.split("-");
  //   let endMonthString = this.startDateObject.value.split("-");
  //   console.log(new Date(Number(startMonthString[0]), Number(startMonthString[1]), 1));
  //   console.log(new Date(Number(endMonthString[0]), Number(endMonthString[1]), 0));


  //   // API CALL and FILL CHART DATA
  //   this.barChartData = {
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [
  //       {
  //         label: 'First Dataset',
  //         data: [65, 59, 80, 81, 56, 55, 40]
  //       },
  //       {
  //         label: 'Second Dataset',
  //         data: [28, 48, 40, 19, 86, 27, 90]
  //       }
  //     ]
  //   };


  //   this.isApiLoading = false;

  // }

// isBarChartDataEmpty() {
//   return (this.barChartData.length == 0) || (this.barChartData.every(item => item === 0));
// }
isBarChartDataEmpty() {
  return false;
}
ngOnInit(): void {
}

stackedData: any;
stackedOptions: any;
constructor() {
  this.stackedData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: '#42A5F5',
        data: [
            50,
            25,
            12,
            48,
            90,
            76,
            42
        ]
    }, {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: '#66BB6A',
        data: [
            21,
            84,
            24,
            75,
            37,
            65,
            34
        ]
    }, {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: '#FFA726',
        data: [
            41,
            52,
            24,
            74,
            23,
            21,
            32
        ]
    }]
};

this.stackedOptions = {
  plugins: {
      legend: {
          labels: {
              color: '#ebedef'
          }
      },
      tooltips: {
          mode: 'index',
          intersect: false
      }
  },
  scales: {
      x: {
          stacked: true,
          ticks: {
              color: '#ebedef'
          },
          grid: {
              color: 'rgba(255,255,255,0.2)'
          }
      },
      y: {
          stacked: true,
          ticks: {
              color: '#ebedef'
          },
          grid: {
              color: 'rgba(255,255,255,0.2)'
          }
      }
  }
};


}

}
