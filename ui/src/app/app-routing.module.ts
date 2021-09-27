import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllExpensesPageComponent } from './main-nav-bar/all-expenses-page/all-expenses-page.component';
import { HomePageComponent } from './main-nav-bar/home-page/home-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'all-expenses', component: AllExpensesPageComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
