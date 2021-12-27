import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  expenses: number[] = [0, 0, 0, 0];

  constructor() { }

  ngOnInit(): void {
  }

  expenseSummary = {
    total: 0,
    groceries: 0,
    home: 0,
    uncommon: 0,
    futile: 0
  }

  expenseSummaryEventListener(expenses: number[]) {

    this.expenseSummary.total = Number(expenses.reduce((a, b) => a + b, 0).toFixed(2));
    this.expenseSummary.home = Number(expenses[0].toFixed(2));
    this.expenseSummary.groceries = Number(expenses[1].toFixed(2));
    this.expenseSummary.uncommon = Number(expenses[2].toFixed(2));
    this.expenseSummary.futile = Number(expenses[3].toFixed(2));

  }

}
