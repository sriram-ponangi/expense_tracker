import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseFormComponent } from './main-nav-bar/home-page/add-expense-form/add-expense-form.component';
import { ExpensesPieChartComponent } from './main-nav-bar/home-page/expenses-pie-chart/expenses-pie-chart.component';
import { MainNavBarComponent } from './main-nav-bar/main-nav-bar.component';
import { HomePageComponent } from './main-nav-bar/home-page/home-page.component';
import { AllExpensesPageComponent } from './main-nav-bar/all-expenses-page/all-expenses-page.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    AddExpenseFormComponent,
    ExpensesPieChartComponent,
    MainNavBarComponent,
    HomePageComponent,
    AllExpensesPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
