import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-expense-form',
  templateUrl: './add-expense-form.component.html',
  styleUrls: ['./add-expense-form.component.css']
})
export class AddExpenseFormComponent implements OnInit { 
  amount = 0.00;

  constructor() { }

  ngOnInit(): void {
  }

}
