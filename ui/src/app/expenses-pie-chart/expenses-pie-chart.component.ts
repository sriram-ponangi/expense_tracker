import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-expenses-pie-chart',
  templateUrl: './expenses-pie-chart.component.html',
  styleUrls: ['./expenses-pie-chart.component.css']
})
export class ExpensesPieChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    var myChart = new Chart("myChart", {
      type: 'pie',
      data: {
        labels: [
          'Groceries',          
          'Home',          
          'Uncommon',
          'Futile',
        ],
        datasets: [{
          data: [300, 300, 300, 300],
          backgroundColor: [
            'rgb(178, 255, 89)', //Groceries            
            'rgb(0, 184, 212)', //Home           
            'rgb(255, 255, 0)', //Uncommon
            'rgb(255, 61, 0)' //Futile
          ]
        }]
      }
    });

  }

}
