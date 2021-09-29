import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseFormComponent } from './main-nav-bar/home-page/add-expense-form/add-expense-form.component';
import { ExpensesPieChartComponent } from './main-nav-bar/home-page/expenses-pie-chart/expenses-pie-chart.component';
import { MainNavBarComponent } from './main-nav-bar/main-nav-bar.component';
import { HomePageComponent } from './main-nav-bar/home-page/home-page.component';
import { AllExpensesPageComponent } from './main-nav-bar/all-expenses-page/all-expenses-page.component';
import { ChartsModule } from 'ng2-charts';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AuthComponent } from './auth/auth.component';


@NgModule({
  declarations: [
    AppComponent,
    AddExpenseFormComponent,
    ExpensesPieChartComponent,
    MainNavBarComponent,
    HomePageComponent,
    AllExpensesPageComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
