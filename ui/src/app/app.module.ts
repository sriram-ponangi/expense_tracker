import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseFormComponent } from './expense-tracker/home-page/add-expense-form/add-expense-form.component';
import { ExpensesPieChartComponent } from './expense-tracker/home-page/expenses-pie-chart/expenses-pie-chart.component';
import { HomePageComponent } from './expense-tracker/home-page/home-page.component';
import { AllExpensesPageComponent } from './expense-tracker/all-expenses-page/all-expenses-page.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChartsModule } from 'ng2-charts';
import { ExpenseOverTimeChartComponent } from './expense-tracker/home-page/expense-over-time-chart/expense-over-time-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    AddExpenseFormComponent,
    ExpensesPieChartComponent,
    HomePageComponent,
    AllExpensesPageComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    NavBarComponent,
    PageNotFoundComponent,
    ExpenseOverTimeChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
