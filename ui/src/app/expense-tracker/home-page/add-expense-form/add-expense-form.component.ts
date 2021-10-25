import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Expense, ExpensesInfo } from '../../models/ExpensesInfo';
import { CreateExpenseService } from '../../services/set-expense/create-expense.service';

@Component({
  selector: 'app-add-expense-form',
  templateUrl: './add-expense-form.component.html',
  styleUrls: ['./add-expense-form.component.css']
})
export class AddExpenseFormComponent implements OnInit {

  /*
  apiResponse = 
  */

  expenseDataValidationErrors: string[];

  hasApiError: boolean;
  isApiLoading: boolean;

  apiErrorResponseMessages: string[];
  apiSuccessResponseMessage: string;

  constructor(private setExpenseService: CreateExpenseService, private formBuilder: FormBuilder) {
    this.apiErrorResponseMessages = [];
    this.expenseDataValidationErrors = [];
    this.apiSuccessResponseMessage = "";

    this.hasApiError = false;
    this.isApiLoading = false;
  }

  addExpenseForm = this.formBuilder.group({
    reason: '',
    cost: 0.0,
    category: '',
    date: ''
  });

  ngOnInit(): void { }

  addExpense(): void {
    this.setDefaultValues();

    this.expenseDataValidationErrors = this.expenseDataValidator(this.addExpenseForm.value);
    console.log(this.expenseDataValidationErrors.length);

    if (this.expenseDataValidationErrors.length > 0) {
      this.hasApiError = false;
      this.isApiLoading = false;
      return;

    } else {


      // let expense: Expense = new Expense(this.addExpenseForm.value.category,
      //   this.addExpenseForm.value.reason, this.addExpenseForm.value.cost);

      // let apiRequest: ExpensesInfo = new ExpensesInfo(new Date(this.addExpenseForm.value.date), [expense]);
      console.log(this.addExpenseForm.value);

      this.setExpenseService.setExpenseInfo(this.addExpenseForm.value).subscribe(response => {

        if (response.responseType === "SUCCESS") {
          console.log(this.apiSuccessResponseMessage);
          this.hasApiError = false;
          this.isApiLoading = false;
          this.apiSuccessResponseMessage = response.data.message;
          console.log(this.apiSuccessResponseMessage);


        } else {
          this.hasApiError = true;
          this.isApiLoading = false;
          console.error("ERROR: ", JSON.stringify(response));
          this.apiErrorResponseMessages = ["Could not insert the expense due to an issue in our server."]

        }

      }, error => {

        console.error(JSON.stringify(error));

        this.hasApiError = true;
        this.isApiLoading = false;

        if (error.error.responseType === 'Error: Bad Request') {
          this.apiErrorResponseMessages = error?.error?.errorMessages;
        } else {
          this.apiErrorResponseMessages = ["API Failed - Could not insert the expense due to an issue in our server."]
        }

      }, () => { // complete
        this.isApiLoading = false;
        this.hasApiError = false;
        this.addExpenseForm.reset();
      });

    }

  }

  expenseDataValidator(data: any): string[] {

    let errorMessages: string[] = [];

    let date = new Date(data.date);
    let isvalidDate = data.date && date.toString() !== 'Invalid Date';
    if (!isvalidDate) {
      errorMessages.push("Please select a valid date.");
    }

    let isValidCategory = ['Home', 'Futile', 'Groceries', 'Uncommon'].includes(data.category);
    if (!isValidCategory) {
      errorMessages.push("Please select a category from the dropdown.");
    }

    let isValidReason = data.reason && data.reason.length > 0;
    if (!isValidReason) {
      errorMessages.push("Please enter a valid reason.");
    }

    let isValidCost = data.cost && (Math.round((data.cost + Number.EPSILON) * 100) / 100) > 0;
    if (!isValidCost) {
      errorMessages.push("Please enter a valid cost.");
    }

    return errorMessages;

  }


  setDefaultValues() {
    this.apiErrorResponseMessages = [];
    this.expenseDataValidationErrors = [];
    this.apiSuccessResponseMessage = "";

    this.hasApiError = false;
    this.isApiLoading = true;
  }

}
