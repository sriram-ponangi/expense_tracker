import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseFormComponent } from './add-expense-form/add-expense-form.component';
import { ExpensesPieChartComponent } from './expenses-pie-chart/expenses-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseFormComponent,
    ExpensesPieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
