import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { APIResponse } from '../models/APIResponse';
import { ExpensesInfo } from '../models/ExpensesInfo';
import { GetExpensesService } from '../services/get-expenses/get-expenses.service';

@Component({
  selector: 'app-all-expenses-page',
  templateUrl: './all-expenses-page.component.html',
  styleUrls: ['./all-expenses-page.component.css']
})
export class AllExpensesPageComponent implements OnInit {

  tablesColumnNames = ["Date", "Reason", "Category", "Cost"];
  tableData: ExpensesInfo[] = [];
  hasApiError = false;
  isApiLoading = true;
  today = new Date();
  startDateObject: FormControl = new FormControl(
    new Date(this.today.getFullYear(), 
    this.today.getMonth(), 1)
    .toISOString().split('T')[0]
  );
  endDateObject: FormControl = new FormControl(
    new Date(this.today.getFullYear(), 
    this.today.getMonth()+1, 0)
    .toISOString().split('T')[0]
  );
 

  constructor(private getExpenseService: GetExpensesService) { }

  ngOnInit(): void {
    this.loadExpenseTableInfo();
  }

  loadExpenseTableInfo() {
    this.isApiLoading = true;
    this.hasApiError = false;

    this.getExpenseService.getExpenseDetails(this.startDateObject.value, this.endDateObject.value, "DETAILED")
      .subscribe(
        response => {
          if (response.responseType === "SUCCESS") {
            this.tableData = response.data.Items;
            console.log(JSON.stringify(this.tableData));

          }
        }, error => {
          console.error(error);
          this.hasApiError = true;
          this.isApiLoading = false;

        }, () => { // complete
          this.isApiLoading = false;
        }
      );
  }

}















  // tableData = [
  //   {
  //     expenses: [
  //       {
  //         category: "Futile",
  //         reason: "Pizza - PP",
  //         cost: 93.56
  //       },
  //       {
  //         category: "Futile",
  //         reason: "Pizza - PP",
  //         cost: 93.56
  //       },
  //       {
  //         category: "Home",
  //         reason: "Rent - SP",
  //         cost: 393.36
  //       },
  //       {
  //         category: "Home",
  //         reason: "Rent - SP",
  //         cost: 393.36
  //       },
  //       {
  //         category: "Home",
  //         reason: "Okay",
  //         cost: 55.2
  //       },
  //       {
  //         category: "Uncommon",
  //         reason: "a",
  //         cost: 45.67
  //       }
  //     ],
  //     date: "2021-07-04"
  //   },
  //   {
  //     expenses: [
  //       {
  //         category: "Futile",
  //         reason: "Pizza - PP",
  //         cost: 93.56
  //       },
  //       {
  //         category: "Home",
  //         reason: "Rent - SP",
  //         cost: 393.36
  //       },
  //       {
  //         category: "Home",
  //         reason: "Rent - SP",
  //         cost: 393.36
  //       },
  //       {
  //         category: "Home",
  //         reason: "Okay",
  //         cost: 55.2
  //       },
  //       {
  //         category: "Groceries",
  //         reason: "XYZ",
  //         cost: 98.76
  //       },
  //       {
  //         category: "Uncommon",
  //         reason: "a",
  //         cost: 45.67
  //       }
  //     ],
  //     date: "2021-07-05"
  //   },
  //   {
  //     expenses: [
  //       {
  //         category: "Home",
  //         reason: "Wifi - EastLink",
  //         cost: 80.54
  //       },
  //       {
  //         category: "Home",
  //         reason: "Rent - The Scotian",
  //         cost: 1195.67
  //       }
  //     ],
  //     date: "2021-09-01"
  //   },
  //   {
  //     expenses: [
  //       {
  //         category: "Futile",
  //         reason: "Pizza - PizzaPiza",
  //         cost: 24.56
  //       },
  //       {
  //         category: "Groceries",
  //         reason: "Atlantic Super Store",
  //         cost: 87.65
  //       }
  //     ],
  //     date: "2021-09-13"
  //   }
  // ];