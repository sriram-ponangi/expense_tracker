import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-expenses-page',
  templateUrl: './all-expenses-page.component.html',
  styleUrls: ['./all-expenses-page.component.css']
})
export class AllExpensesPageComponent implements OnInit {

  tablesColumnNames = ["Date", "Reason", "Category", "Cost"];

  tableData = [
    {
      expenses: [
        {
          category: "Futile",
          reason: "Pizza - PP",
          cost: 93.56
        },
        {
          category: "Home",
          reason: "Rent - SP",
          cost: 393.36
        },
        {
          category: "Home",
          reason: "Rent - SP",
          cost: 393.36
        },
        {
          category: "Home",
          reason: "Okay",
          cost: 55.2
        },
        {
          category: "Groceries",
          reason: "XYZ",
          cost: 98.76
        },
        {
          category: "Uncommon",
          reason: "a",
          cost: 45.67
        }
      ],
      date: "2021-07-05"
    },
    {
      expenses: [
        {
          category: "Home",
          reason: "Wifi - EastLink",
          cost: 80.54
        },
        {
          category: "Home",
          reason: "Rent - The Scotian",
          cost: 1195.67
        }
      ],
      date: "2021-09-01"
    },
    {
      expenses: [
        {
          category: "Futile",
          reason: "Pizza - PizzaPiza",
          cost: 24.56
        },
        {
          category: "Groceries",
          reason: "Atlantic Super Store",
          cost: 87.65
        }
      ],
      date: "2021-09-13"
    }
  ];



  constructor() { }

  ngOnInit(): void {
  }

}