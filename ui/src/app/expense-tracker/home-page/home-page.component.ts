import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  expenses: number[] = [0,0,0,0];

  constructor() { }

  ngOnInit(): void {
  }

  expenseSummary = {
    total :  0,
    groceries: 0,
    home:  0,
    uncommon: 0,
    futile: 0
  }
  
  expenseSummaryEventListener(expenses: number[]){

    this.expenseSummary.total =  expenses.reduce((a, b)=>a + b, 0);
    this.expenseSummary.home = expenses[0];
    this.expenseSummary.groceries = expenses[1];
    this.expenseSummary.uncommon = expenses[2];
    this.expenseSummary.futile = expenses[3];

    console.log(this.expenseSummary);
    
  }

}
